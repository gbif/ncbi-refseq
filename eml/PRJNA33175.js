
module.exports = pubDate => `<eml:eml xmlns:eml="eml://ecoinformatics.org/eml-2.1.1"
xmlns:dc="http://purl.org/dc/terms/"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="eml://ecoinformatics.org/eml-2.1.1 http://rs.gbif.org/schema/eml-gbif-profile/1.1/eml.xsd"
system="http://gbif.org" scope="system"
xml:lang="eng">

<dataset>
<alternateIdentifier>http://www.ncbi.nlm.nih.gov/bioproject/PRJNA33175</alternateIdentifier>
<title xml:lang="eng">Bacterial 16S Ribosomal RNA RefSeq Targeted Loci Project</title>
<creator>
<individualName>
<givenName>Richard</givenName>
<surName>McVeigh</surName>
</individualName>
<organizationName>National Center for Biotechnology Information</organizationName>
<positionName>Prokaryote RefSeq curator</positionName>
<address>
<deliveryPoint>8600 Rockville Pike</deliveryPoint>
<city>Bethesda</city>
<administrativeArea>MD</administrativeArea>
<postalCode>20894</postalCode>
<country>UNITED STATES</country>
</address>
<electronicMailAddress>mcveigh@ncbi.nlm.nih.gov</electronicMailAddress>
<onlineUrl>https://www.ncbi.nlm.nih.gov/</onlineUrl>
</creator>

<pubDate>
${pubDate}
</pubDate>
<language>eng</language>
<abstract>
<para>The small subunit ribosomal RNA is a useful phylogenetic marker that has been used extensively for evolutionary analyses. The RefSeq dataset contains curated 16S ribosomal RNA sequences that correspond to bacteria type materials. The RefSeq records may contain corrections to the sequence or taxonomy as compared to the original INSD submission, and may have additional information added that is not found in the original. All sequences will have the same project ID and can be found as such. Database URL: http://www.ncbi.nlm.nih.gov/bioproject/PRJNA33175.</para>
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
   <citation identifier="DOI:10.1093/nar/gkv1189">O'Leary, N.A., Wright, M.W., Brister, J.R., Ciufo, S., Haddad, D., McVeigh, R., Rajput, B., Robbertse, B., Smith-White, B., Ako-Adjei, D., Astashyn, A., Badretdin, A., B??o, Y., Blinkova, O., Brover, V., Chetvernin, V., Choi, J., Cox, E., Ermolaeva, O.D., Farrell, C.M., Goldfarb, T., Gupta, T., Haft, D.H., Hatcher, E., Hlavina, W., Joardar, V.S., Kodali, V.K., Li, W.J., Maglott, D.R., Masterson, P., McGarvey, K.M., Murphy, M.R., O'Neill, K., Pujar, S., Rangwala, S.H., Rausch, D., Riddick, L.D., Schoch, C.L., Shkeda, A., Storz, S.S., Sun, H., Thibaud-Nissen, F., Tolstoy, I., Tully, R.E., Vatsan, A.R., Wallin, C., Webb, D., Wu, W.X., Landrum, M.J., Kimchi, A., Tatusova, T.A., DiCuccio, M., Kitts, P.A., Murphy, T.D., Pruitt, K.D. (2016). Reference sequence (RefSeq) database at NCBI: current status, taxonomic expansion, and functional annotation. Nucleic Acids Research, 44, D733 - D745.</citation>
   <citation identifier="DOI:10.1093/database/bax072">Conrad L Schoch, Stacy Ciufo, Mikhail Domrachev, Carol L Hotton, Sivakumar Kannan, Rogneda Khovanskaya, Detlef Leipe, Richard Mcveigh, Kathleen O???Neill, Barbara Robbertse, Shobha Sharma, Vladimir Soussov, John P Sullivan, Lu Sun, Se??n Turner, Ilene Karsch-Mizrachi, NCBI Taxonomy: a comprehensive update on curation, resources and tools, Database, Volume 2020, 2020, baaa062</citation>
 </bibliography>
</gbif>
</metadata>
</additionalMetadata>
</eml:eml>
`