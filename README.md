# photo-namer
Rename files that have IDs as a batch.

This uses a JSON file containing records to rename in ranges.

Very useful for renaming a bunch of photos where you want the same name for multiple sequential IDs.

For example when you want a bunch of files like:
```
A0000101.jpg
A0000102.jpg
A0000103.jpg
A0000104.jpg
```

to all have the prefix `Artist_Title_2017_`.

You specify the first ID (`start: 101`), and it will rename up until the `start:` of the next record.


## Install packages
- Run either `npm i` or, if preferred `yarn`.

## Record format
See `records.json`.

Make a records.json inside the directory you want to run renames on.

Structure to match:
```
/path
  /records.json
  /subfolderA
    A0000102.jpg
  /subfolderB
    A0000102.jpg
```

## Dry run
- `node index.js "/directory/path/"`

## Actual run

- In `index.js`,  change dryRun to `= false`

- `node index.js "/directory/path/"`

## Generate CSV from records file

_ Note this takes the records.json path, not the folder. _
- `node csv.js "/directory/path/records.json"`
