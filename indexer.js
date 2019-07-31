const csvParse = require('csv-parse');
const { SearchService } = require('azure-search-client');
const { createReadStream } = require('fs');
const { pipeline, Transform } = require('stream');

const COLUMNS = ['tconst', 'titleType', 'primaryTitle', 'originalTitle', 'isAdult', 'startYear', 'endYear', 'runtimeMinutes', 'genres'];
const NIL = '\\N';
const INDEX_NAME = 'imdb';
const INDEX = new SearchService(process.env.SEARCH_SERVICE, process.env.SEARCH_KEY)
  .indexes
  .use(INDEX_NAME);

let count = 0;

pipeline(
  createReadStream('./data/title.basics.tsv'),
  csvParse({ delimiter: '\t', cast: false, quote: null, from: 2, escape: '\\', columns: COLUMNS }),
  new Transform({
    objectMode: true,
    transform(obj, enc, cb) {
      cb(null, mapTitleBasic(obj));
    },
  }),
  INDEX.createIndexingStream(),
  (err) => {
    if (err) { console.error(err); }
  }
).on('data', (d) => console.log(count += d.length));

function mapTitleBasic(obj) {
  const {
    tconst,
    titleType,
    primaryTitle,
    originalTitle,
    isAdult,
    startYear,
    endYear,
    runtimeMinutes,
    genres } = obj;

  return {
    tconst,
    titleType: checkNil(titleType),
    primaryTitle: checkNil(primaryTitle),
    originalTitle: originalTitle === primaryTitle ? null : originalTitle,
    isAdult: isAdult === '1',
    startYear: +startYear,
    endYear: +endYear,
    runtimeMinutes: +runtimeMinutes,
    genres: checkListNil(genres),
  };
}

function checkListNil(val) {
  return checkNil(val, (val) => val.split(',')) || [];
}

function checkNil(val, fn) {
  if (val === NIL) {
    return null;
  } else if (fn) {
    return fn(val);
  } else {
    return val;
  }
}
