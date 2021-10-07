# API adapter to retrieve NCBI RefSeq Targeted Loci Projects as DwC

### Requirements
nodejs  - tested with v14.15.0 but probably works with any recent version

### Usage
```
npm install --save
node crawl.js PRJNA177353
```

### Output files
```
data/eml.xml
data/meta.xml
data/dna.txt
data/occurrence.txt
```

These can be zipped to a DwC archive

