// Configuration
const usefulFileTypes = ['3FR', 'tif', 'jpg'];
const dryRun = true;

const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const rootFolder = _.last(process.argv);
const {data, config} = require(path.join(rootFolder, 'records.json'));

const getDirectories = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory());

const {
  end,
  prefix,
  significantCharacters
} = config;

const range = _.range(_.head(data).start, end + 1);

const transformName = namePart =>
  _(namePart)
    .chain()
     // Hack to smuggle symbols through startCase.
    .replace('(', ' aaaaa ')
    .replace(')', ' bbbbb ')
    .replace('$', ' ccccc ')
    .replace('¥', ' ddddd ')
    .replace('€', ' eeeee ')
    .replace('#', ' fffff ')
    .replace('-', ' ggggg ')
    .replace('/', ' hhhhh ')
    .words()
    .map(_.startCase)
    .join('')
    .replace('Aaaaa', '(')
    .replace('Bbbbb', ')')
    .replace('Ccccc', '$')
    .replace('Ddddd', '¥')
    .replace('Eeeee', '€')
    .replace('Fffff', '#')
    .replace('Ggggg', '-')
    .replace('Hhhhh', '-')
    .value();


const hash = _(range)
  .map((index) => {
    const item = _.findLast(data, record => record.start <= index);
    const string = _([
      item.artist,
      item.title,
      item.year,
    ])
      .compact()
      .map(transformName)
      .join('_');
    return [_.padStart(index, significantCharacters, '0'), string];
  })
  .fromPairs()
  .value();

const directories = getDirectories(rootFolder);

_.forEach( directories, (directory) => {
  const fileDirectory = path.join(rootFolder, directory);
  console.log('folder', fileDirectory);

  const files = fs.readdirSync(fileDirectory);
  _.forEach(files, (currentFile) => {
    const fileNameParts = currentFile.split('.');
    if (!_.includes(usefulFileTypes, _.last(fileNameParts))) { return; }
    const title = _.head(fileNameParts);
    const id = _.slice(title, title.length - significantCharacters).join('');
    const newNamePrefix = hash[id];
    if (newNamePrefix === undefined) { return; }
    const newName = [newNamePrefix, '_', prefix, id, '.', _.last(fileNameParts)].join('');

    const oldPath = path.join(fileDirectory, currentFile);
    const newPath = path.join(fileDirectory, newName);
    if (oldPath === newPath) { return; }

    if (dryRun) {
      console.log(currentFile, 'would rename to', newName);
    }
    else {
      console.log(currentFile, 'renaming to', newName);
      fs.renameSync(oldPath, newPath);
    }
  });
});

console.log('All done!');
