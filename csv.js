const _ = require('lodash');

// Configuration
const recordsDirectory = _.last(process.argv);

const fs = require('fs');

const records = require(recordsDirectory);

const header = 'Start, End, Artist, Title, Year';

const body = _(records)
  .map((record, index) => {
    const string = _([
      record.start,
      ((records[index + 1] || {}).start - 1) || record.start,
      record.artist,
      _.isString(record.title) ? '"' + record.title + '"' : undefined,
      record.year,
    ])
      .compact()
      .join();
    return string;
  })
  .value();


fs.writeFileSync(_.replace(recordsDirectory, '.json', '.csv'), _.concat([header], body).join('\n'));
console.log('All done!')
