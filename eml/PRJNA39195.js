module.exports = pubDate => `<eml:eml xmlns:eml="eml://ecoinformatics.org/eml-2.1.1"
xmlns:dc="http://purl.org/dc/terms/"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="eml://ecoinformatics.org/eml-2.1.1 http://rs.gbif.org/schema/eml-gbif-profile/1.1/eml.xsd"
system="http://gbif.org" scope="system"
xml:lang="eng">

<dataset>
<alternateIdentifier>http://www.ncbi.nlm.nih.gov/bioproject/PRJNA39195</alternateIdentifier>
<title xml:lang="eng">Fungal 18S Ribosomal RNA (SSU) RefSeq Targeted Loci Project</title>
<creator>
<individualName>
<givenName>Barbara</givenName>
<surName>Robbertse</surName>
</individualName>
<organizationName>National Center for Biotechnology Information</organizationName>
<positionName>Fungal RefSeq curator</positionName>
<address>
<deliveryPoint>8600 Rockville Pike</deliveryPoint>
<city>Bethesda</city>
<administrativeArea>MD</administrativeArea>
<postalCode>20894</postalCode>
<country>UNITED STATES</country>
</address>
<electronicMailAddress>barbara.robbertse@nih.gov</electronicMailAddress>
<onlineUrl>https://www.ncbi.nlm.nih.gov/</onlineUrl>
</creator>

<pubDate>
${pubDate}
</pubDate>
<language>eng</language>
<abstract>
<para>The 18S ribosomal RNA targeted loci project is a RefSeq curated data set sourced from INSDC records. At a minimum the sequence contains most of the variable V4 region and part of the V5 region and each record contain a collection identifier (predominantly type material) from a public collection. The presence of the 18S signature has been verified by the ribovore pipeline (https://github.com/nawrockie/ribovore) using hidden Markov and covariance models. Other verification steps for example checking for vector sequences, too many ambiguous nucleotides, and misassembled sequences are also included. SSU RefSeq accessions (NG_ ) include sequences mostly obtained from type specimens and a few from reference specimens. Type and reference identifiers are curated by NCBI Taxonomy. The collection source of type material is indicated in each record and collection acronyms follows the collection codes maintained at https://www.ncbi.nlm.nih.gov/biocollections/. All sequences will have the same project ID and can be found as such. Database URL: http://www.ncbi.nlm.nih.gov/bioproject/PRJNA39195.</para>
</abstract>
<keywordSet>
   <keyword>Metadata</keyword>
<keywordThesaurus>GBIF Dataset Type Vocabulary: http://rs.gbif.org/vocabulary/gbif/dataset_type.xml</keywordThesaurus>
</keywordSet>
<intellectualRights>
<para>This work is licensed under a <ulink url="http://creativecommons.org/licenses/by/4.0/legalcode"><citetitle>Creative Commons Attribution (CC-BY) 4.0 License</citetitle></ulink>.</para>
</intellectualRights>

<maintenance>
<description>
<para></para>
</description>
<maintenanceUpdateFrequency>unkown</maintenanceUpdateFrequency>
</maintenance>


</dataset>
<additionalMetadata>
<metadata>
<gbif>
 <bibliography>
   <citation identifier="DOI:10.1093/nar/gkv1189">O'Leary, N.A., Wright, M.W., Brister, J.R., Ciufo, S., Haddad, D., McVeigh, R., Rajput, B., Robbertse, B., Smith-White, B., Ako-Adjei, D., Astashyn, A., Badretdin, A., Bào, Y., Blinkova, O., Brover, V., Chetvernin, V., Choi, J., Cox, E., Ermolaeva, O.D., Farrell, C.M., Goldfarb, T., Gupta, T., Haft, D.H., Hatcher, E., Hlavina, W., Joardar, V.S., Kodali, V.K., Li, W.J., Maglott, D.R., Masterson, P., McGarvey, K.M., Murphy, M.R., O'Neill, K., Pujar, S., Rangwala, S.H., Rausch, D., Riddick, L.D., Schoch, C.L., Shkeda, A., Storz, S.S., Sun, H., Thibaud-Nissen, F., Tolstoy, I., Tully, R.E., Vatsan, A.R., Wallin, C., Webb, D., Wu, W.X., Landrum, M.J., Kimchi, A., Tatusova, T.A., DiCuccio, M., Kitts, P.A., Murphy, T.D., Pruitt, K.D. (2016). Reference sequence (RefSeq) database at NCBI: current status, taxonomic expansion, and functional annotation. Nucleic Acids Research, 44, D733 - D745.</citation>
   <citation identifier="DOI:10.1186/s12859-021-04316-z">Schäffer AA, McVeigh R, Robbertse B, Schoch CL, Johnston A, Underwood BA, Karsch-Mizrachi I, Nawrocki EP. Ribovore: ribosomal RNA sequence analysis for GenBank submissions and database curation. BMC Bioinformatics. 2021 Aug 12;22(1):400.</citation>
 </bibliography>
</gbif>
</metadata>
</additionalMetadata>
</eml:eml>
`