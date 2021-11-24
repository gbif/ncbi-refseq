const NcbiApi = require("ncbi-entrez-api");
const _ = require("lodash");
const parseString = require("xml2js").parseString;
const gene = NcbiApi.dbFactory(NcbiApi.DB.NUCCORE);
const taxonomy = NcbiApi.dbFactory(NcbiApi.DB.TAXONOMY);

const canonicalRanks = {
  kingdom: true,
  phylum: true,
  class: true,
  order: true,
  family: true,
  genus: true,
};

const getData = (term, offset = 0, limit = 20) => {
  return new Promise((resolve, reject) => {
    gene.esearch(
      {
        term: term,
        retmode: "json",
        retstart: offset,
        retmax: limit,
      },
      (err, res, data) => {
        if (err) {
          console.log(err);
        }
        const retstart = Number(_.get(data, "esearchresult.retstart"));
        const retmax = Number(_.get(data, "esearchresult.retmax"));
        const count = Number(_.get(data, "esearchresult.count"));

        if (
          _.get(data, "esearchresult.idlist") &&
          _.get(data, "esearchresult.idlist").length > 0
        ) {
          const idList = _.get(data, "esearchresult.idlist");

          gene.efetch(
            {
              ids: idList,
              retmode: "xml",
              rettype: "gbc",
            },
            (err, res, data) => {
              if (err) {
                console.log("Error fetching taxa " + idList.join(", "));
                reject(err);
              }
              parseString(data, { trim: true }, (error, result) => {
                if (error) {
                  console.log("Error at offset " + retstart);
                  console.log("Error parsing Sequence XML");
                  reject(error);
                } else {
                  const dataObjects = _.get(result, "INSDSet.INSDSeq", []);

                  const genbankData = dataObjects.map((element) => {
                    // console.log(JSON.stringify(element, null, 2))
                    const primaryAccession = _.get(
                      element,
                      "INSDSeq_primary-accession[0]"
                    );
                    const otherSeqIds = _.get(
                      element,
                      "INSDSeq_other-seqids[0].INSDSeqid"
                    );
                    const title = _.get(element, "INSDSeq_definition[0]");
                    const insdcTaxon = _.get(element, "INSDSeq_organism[0]");
                    const sequence = _.get(element, "INSDSeq_sequence[0]");
                    const taxonomy = _.get(element, "INSDSeq_taxonomy[0]");
                    const comment = _.get(element, "INSDSeq_comment[0]");
                    const id = _.get(element, "INSDSeq_locus[0]");
                    const ref = _.get(
                      element,
                      "INSDSeq_references[0].INSDReference[0]"
                    );
                    // console.log(JSON.stringify(element, null, 2))
                    const reference = {
                      authors: _.get(
                        ref,
                        "INSDReference_authors[0].INSDAuthor",
                        []
                      ),
                      title: _.get(ref, "INSDReference_title[0]", ""),
                      journal: _.get(ref, "INSDReference_journal[0]", ""),
                    };
                    const dataRow = _.get(
                      element,
                      '["INSDSeq_feature-table"][0]["INSDFeature"]'
                    );
                    const source = dataRow.find(
                      (e) => _.get(e, "INSDFeature_key[0]") === "source"
                    );
                    let retVal = {
                      id: id,
                      title: title,
                      scientificName: insdcTaxon,
                      primaryAccession: primaryAccession,
                      otherAccessions: otherSeqIds,
                      sequence: sequence,
                      reference: reference,
                      taxonomy: taxonomy,
                      comment: comment,
                    };
                    if (source) {
                      const INSDQualifiers = _.get(
                        source,
                        "INSDFeature_quals[0].INSDQualifier"
                      );
                      if (INSDQualifiers) {
                        INSDQualifiers.forEach((v) => {
                          retVal[_.get(v, "INSDQualifier_name[0]")] = _.get(
                            v,
                            "INSDQualifier_value[0]"
                          );
                        });
                      }
                    }
                    return retVal;
                  });

                  resolve({
                    offset: retstart,
                    limit: retmax,
                    count: count,
                    empty: false,
                    result: genbankData,
                  });
                }
              });
            }
          );
        } else {
          resolve({
            offset: retstart,
            count: 0,
            empty: true,
          });
        }
      }
    );
  });
};

const getTaxa = (idList) => {
  return new Promise((resolve, reject) => {
    taxonomy.efetch(
      {
        ids: idList,
        retmode: "xml",
      },
      (err, res, data) => {
        if (err) {
          console.log("Error fetching taxa " + idList.join(", "));
          reject(err);
        }
        parseString(data, { trim: true }, (error, result) => {
          if (error) {
            console.log("Error fetching taxa " + idList.join(", "));
            console.log("Error parsing taxon XML");
            reject(error);
          } else {
            // console.log(JSON.stringify(result, null, 2));
            const dataObjects = _.get(result, "TaxaSet.Taxon", []);
            const genbankData = dataObjects.map((element) => {
              let taxon = {};
              taxon.id = _.get(element, "TaxId[0]", "");
              taxon.canonicalName = _.get(element, "ScientificName[0]", "");
              const sciName = _.get(element, "OtherNames[0].Name", []).find(
                (e) => _.get(e, "ClassCDE[0]") === "authority" && (_.get(e, "DispName[0]", "").startsWith(taxon.canonicalName)) || _.get(e, "DispName[0]", "").startsWith(`"${taxon.canonicalName}"`) );
              if (sciName) {
                taxon.scientificName = _.get(sciName, "DispName[0]");
              }
              taxon.rank = _.get(element, "Rank[0]", "");
              taxon.parentID = _.get(element, "ParentTaxId[0]", "");
              taxon.canonicalRanks = {};
              taxon.classification = _.get(
                element,
                "LineageEx[0].Taxon",
                []
              ).map((t) => {
                if (canonicalRanks[_.get(t, "Rank[0]", "")]) {
                  taxon.canonicalRanks[_.get(t, "Rank[0]")] = _.get(
                    t,
                    "ScientificName[0]"
                  );
                }
                return {
                  id: _.get(t, "TaxId[0]", ""),
                  rank: _.get(t, "Rank[0]", ""),
                  scientificName: _.get(t, "ScientificName[0]", ""),
                };
              });
              return taxon;
            });
            resolve(_.keyBy(genbankData, "id"));
          }
        });
      }
    );
  });
};

module.exports = {
  getData: getData,
  getTaxa: getTaxa,
};
