const config = require("./config.json");
const ncbi = require("./ncbiApi");
const fs = require("fs");
const _ = require("lodash");
const typeStatus = require("./typeStatus.json");
const md5 = require("md5");
const { exit } = require("process");
const BASIS_OF_RECORD = "MATERIAL_SAMPLE";
const LIMIT = 100;

const getTypeStatus = (record) => {
  if (!record.type_material) {
    return "";
  } else {
    const splitted = record.type_material.split(" ");
    if (typeStatus.indexOf(splitted[0].toUpperCase()) > -1) {
      return splitted[0].toUpperCase();
    } else if (
      splitted[0] === "culture" &&
      splitted[1] === "from" &&
      typeStatus.indexOf(splitted[2].toUpperCase()) > -1
    ) {
      return splitted[2].toUpperCase();
    } else {
      return record.type_material;
    }
  }
};

getLatLon = (record) => {
  if (!record.lat_lon) {
    return `\t`;
  } else {
    const splitted = record.lat_lon.split(" ");
    const lat = splitted[1] === "N" ? splitted[0] : `-${splitted[0]}`;
    const lon = splitted[3] === "E" ? splitted[2] : `-${splitted[2]}`;
    if (true) {
      return `${lat}\t${lon}`;
    } else {
      return ``;
    }
  }
};

getCountryAndLocality = (record) => {
  if (!record.country) {
    return "\t";
  } else {
    const splitted = record.country.split(": ");
    if (splitted.length > 1) {
      return `${splitted[0]}\t${splitted[1]}`;
    } else {
      return `${record.country}\t`;
    }
  }
};

getPrimers = (record) => {
  if (!record.PCR_primers) {
    return `\t\t\t`;
  } else {
    const splitted = record.PCR_primers.split(", ");
    let primers = {};
    splitted.forEach((e) => {
      const splt = e.split(": ");
      primers[splt[0]] = splt[1];
    });
    return `${primers.fwd_name || ""}\t${primers.rev_name || ""}\t${
      primers.fwd_seq || ""
    }\t${primers.rev_seq || ""}`;
  }
};

getAssociatedReferences = (record) => {
  const ref = record.reference;
  if (!ref) {
    return "";
  } else {
    return `${ref.authors ? ref.authors.join(", ") : ""} ${ref.title || ""} ${
      ref.journal || ""
    }.`;
  }
};

getTaxonConceptID = (record) => {
  // console.log(record.db_xref.split("taxon:")[1])
  if (!record.db_xref) {
    return "";
  } else {
    const splitted = record.db_xref.split("taxon:");
    const taxonID = _.get(splitted, "[1]");
    return taxonID
      ? `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${taxonID}`
      : "";
  }
};
getOriginalAccesion = (record) => {
  const splitted = record.comment
    ? record.comment.split(
        "REVIEWED REFSEQ: This record has been curated by NCBI staff. The reference sequence is identical to "
      )
    : [];
  if (_.get(splitted, "[1]")) {
    const secondary = splitted[1].split(".")[0].split(":")[0];

    return secondary || "";
  } else {
    return "";
  }
};
getAssociatedSequences = (record) => {
  const originalAccession = getOriginalAccesion(record);
  if (originalAccession) {
    return `https://www.ncbi.nlm.nih.gov/nuccore/${record.id} | https://www.ncbi.nlm.nih.gov/nuccore/${originalAccession}`;
  } else {
    return `https://www.ncbi.nlm.nih.gov/nuccore/${record.id}`;
  }
};

const getTaxonID = (record) => {
  if (!record.db_xref) {
    return "";
  } else {
    const splitted = record.db_xref.split("taxon:");
    const taxonID = _.get(splitted, "[1]", "");
    return taxonID;
  }
};

const getHigherTaxa = (record, defaultKingdom) => {
  const canonicalRanks = _.get(record, "taxon.canonicalRanks");
  if (!canonicalRanks) {
    return `\t\t\t\t\t`;
  } else {
    return `${canonicalRanks["kingdom"] || defaultKingdom || ""}\t${
      canonicalRanks["phylum"] || ""
    }\t${canonicalRanks["class"] || ""}\t${canonicalRanks["order"] || ""}\t${
      canonicalRanks["family"] || ""
    }\t${canonicalRanks["genus"] || ""}`;
  }
};

const getInstitutionCode = record => {
  if(!record.specimen_voucher && !record.culture_collection){
    return "";
  } else if(record.specimen_voucher) {
    const splitted = record.specimen_voucher.split(":");
    return splitted[0]
  } else if(record.culture_collection){
    const splitted = record.culture_collection.split(":");
    return splitted[0]
  }
}

const getPage = async (term, offset, retries = 5) => {
  let ret = retries;
  let done = false;
  while (!done && ret > 0) {
    try {
      const data = await ncbi.getData(term, offset, LIMIT);
      done = true;
      return data;
    } catch (error) {
      ret = ret - 1;
      console.log("Error, retrying " + ret + " of " + retries + "times");
    }
  }
  throw new Error("Retried " + retries + " times, but no luck");
};

const attachTaxa = async (data, retries = 5) => {
  let ret = retries;
  let done = false;
  const taxonIdList = data.result.map(getTaxonID);
  while (!done && ret > 0) {
    try {
      const taxa = await ncbi.getTaxa(taxonIdList);
      data.result.forEach((d) => {
        const taxonID = getTaxonID(d);
        const taxon = _.get(taxa, taxonID);
        if (taxon) {
          d.taxon = taxon;
        }
      });
      done = true;
      return data;
    } catch (error) {
      ret = ret - 1;
      console.log("Error, retrying " + ret + " of " + retries + "times");
    }
  }
  throw new Error("Retried " + retries + " times, but no luck");
};

const writeDwc = async (term, projectConfig) => {
  const { marker, title, defaultKingdom } = projectConfig;
  var occStream = fs.createWriteStream(__dirname + "/data/occurrence.txt", {
    flags: "a",
  });
  var dnaStream = fs.createWriteStream(__dirname + "/data/dna.txt", {
    flags: "a",
  });
  occStream.on('finish', () =>  console.log(`Done writing ${term}`))

  let offset = 0;
  let finished = false;
  while (!finished) {
    const dataWithoutTaxa = await getPage(term, offset);
    const data = await attachTaxa(dataWithoutTaxa);
    if (!data.empty) {
      data.result.forEach((row) => {
        const classification = row.taxonomy ? row.taxonomy.split("; ") : [];
        // occurrenceId, scientificName, higherClassification, typeStatus, decimalLatitude, decimalLongitude, country, locality, eventDate, recordedBy, identifiedBy, catalogueNumber, associatedReferences, occurrenceRemarks, taxonID, taxonConceptID, associatedSequences, otherCatalogNumbers
        occStream.write(
          `${row.primaryAccession}\t${row.primaryAccession}\t${_.get(
            row,
            "taxon.scientificName",
            row.scientificName
          )}\t${
            classification.length > 0 ? classification.join(" | ") : ""
          }\t${getTypeStatus(row)}\t${getLatLon(row)}\t${getCountryAndLocality(
            row
          )}\t${row.collection_date || ""}\t${row.collected_by || ""}\t${
            row.indentified_by || ""
          }\t${row.specimen_voucher || row.culture_collection || ""}\t${getAssociatedReferences(
            row
          )}\t${BASIS_OF_RECORD}\t${row.title}\tASV:${md5(
            row.sequence
          )}\t${getTaxonConceptID(row)}\t${getAssociatedSequences(
            row
          )}\t${getOriginalAccesion(row)}\t${getHigherTaxa(row, defaultKingdom)}\t${getInstitutionCode(row)}\n`
        );
        // coreId, marker, sequence, primer_name_forward, primer_name_reverse, pcr_primer_forward, pcr_primer_reverse
        dnaStream.write(
          `${row.primaryAccession}\t${marker}\t${row.sequence}\t${getPrimers(
            row
          )}\t${title}\n`
        );
      });
      console.log(
        "Fetching records " +
          data.offset +
          " to " +
          (data.offset + data.limit) +
          " of " +
          data.count
      );
      if (data.offset + data.limit < data.count) {
        offset += data.limit;
      } else {
        finished = true;
        occStream.end();
        dnaStream.end();
      }
    } else {
      finished = true;
      occStream.end();
      dnaStream.end();
    }
  }
};

const writeEml = (projectName) => {
    console.log("Writing EML")
    var readStream = fs.createReadStream(__dirname + `/eml/${projectName}.xml`);
    var writeStream = fs.createWriteStream(__dirname + "/data/eml.xml")
    readStream.pipe(writeStream);
    writeStream.on('finish', () => console.log("EML Done."))

}

const projectName = _.get(process.argv.slice(2), '[0]');
if (!config[projectName]) {
  console.log(
    "Please provide a valid BioProject ID, options are: " +
      Object.keys(config).join(", ")
  );
  exit();
} else {
  const term = `${projectName}[BioProject]`;
  writeDwc(term, config[projectName]);
  writeEml(projectName);
}
