# Repo package version info

This script can be run on a project `package.json` file to generate a report of dependencies with the following information:

```js
  {
    name: 'yargs',
    version: '^17.2.1',
    versionDate: '2021-9-25',
    latestVersion: '17.2.1',
    latestVersionDate: '2021-9-25',
    daysBehindLatestVersion: 0    
  }
```

If run with `--verbose` setting you can additionally get the following information (versions are last 5 versions published)

```js
{
   description: 'yargs the modern, pirate-themed, successor to optimist.',
    license: 'MIT',
    homepage: 'https://yargs.js.org/',
    author: 'bcoe, oss-bot',
    versions: [ '17.1.0', '17.1.1-candidate.0', '17.1.1', '17.2.0', '17.2.1' ]
}
```

The report can also be stored in a `.json` file. The json file can then be exported to an `.xslx` file (for Excel).

## Fetch package.json from Github repo

You can fetch a `package.json` from a private github repo using the following command

```bash
$ curl -GLOf -H "Authorization: token ${GITHUB_TOKEN?not set}" -H "Accept: application/vnd.github.v4.raw" \
  "https://api.github.com/repos/$ORG/$REPO/contents/$FILEPATH" -d ref="$REVISION"
```

Alternatively you can go to the file on the Github page, click `raw` and download from there.

## Usage

Usage help

```bash
$ node src/run.mjs --help

Commands:
  run.mjs pkg-info [pkgfile]  fetch package info from package.json file

Options:
      --help     Show help                                     [boolean]
      --version  Show version number                           [boolean]
  -v, --verbose  Verbose package info                          [boolean]
  -o, --output   Output file to store the report                [string]
  ```

Print basic report

```bash
$ node src/run.mjs pkg-info package.json

Processing: package.json
[
  {
    name: 'diff-dates',
    version: '^1.0.14',
    versionDate: '2021-3-2',
    latestVersion: '1.0.14',
    latestVersionDate: '2021-3-2',
    daysBehindLatestVersion: 0
  },
  {
    name: 'got',
    version: '^11.8.2',
    versionDate: '2021-2-26',
    latestVersion: '12.0.0-beta.4',
    latestVersionDate: '2021-8-12',
    daysBehindLatestVersion: 167
  },
  {
    name: 'read-pkg',
    version: '^7.0.0',
    versionDate: '2021-8-15',
    latestVersion: '7.0.0',
    latestVersionDate: '2021-8-15',
    daysBehindLatestVersion: 0
  },
  {
    name: 'registry-url',
    version: '^6.0.0',
    versionDate: '2021-4-17',
    latestVersion: '6.0.0',
    latestVersionDate: '2021-4-17',
    daysBehindLatestVersion: 0
  },
  {
    name: 'semver',
    version: '^7.3.5',
    versionDate: '2021-3-23',
    latestVersion: '7.3.5',
    latestVersionDate: '2021-3-23',
    daysBehindLatestVersion: 0
  },
  {
    name: 'yargs',
    version: '^17.2.1',
    versionDate: '2021-9-25',
    latestVersion: '17.2.1',
    latestVersionDate: '2021-9-25',
    daysBehindLatestVersion: 0
  }
]
```

Generate and store basic report

```bash
$ node src/run.mjs pkg-info package.json --output report.json

Processing: package.json
Writing to file: report.json
Done :)
```

Generate and store verbose report

```bash
$ node src/run.mjs pkg-info package.json --verbose --output report.json

Processing: package.json
Writing to file: report.json
Done :)

```

## Generate XLS (Excel) report

```bash
$ node src/run.mjs xls-report report.json

Generating XLS report file for: report.json
Writing to file: report_2021-12-09.json
Done :)
```
