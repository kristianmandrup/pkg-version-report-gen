# Repo package version info

This script can be run on a project `package.json` file to generate a report of dependencies with the following information:

```js
    {
    name: 'yargs',
    version: '17.2.1',
    versionDate: '2021-9-25',
    semVerDiff: 'minor',
    numVersionDiff: '0.3.0',
    latestVersion: '17.5.1',
    latestVersionDate: '2022-5-16',
    daysBehindLatestVersion: 232,
    invalid: false
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
  -o, --output   Output file to store the report               [string]
  -r, --rules    Path to rules file                            [string]
  -s, --maxSemVerDiff  maximum semver diff such as: minor               [string]
  -d, --maxDays        maximum number of days since last release        [string]  
  ```

Print basic report

```bash
$ node src/run.mjs pkg-info package.json

Processing: package.json
[
  {
    name: 'yargs',
    version: '17.2.1',
    versionDate: '2021-9-25',
    semVerDiff: 'minor',
    numVersionDiff: '0.3.0',
    latestVersion: '17.5.1',
    latestVersionDate: '2022-5-16',
    daysBehindLatestVersion: 232,
    invalid: false
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

### Run against rules

Create a rules file such as:

```json
{
    "maxSemVerDiff": "minor",
    "maxDays": 180
}
```

Then rule with the `-r` option pointing to the rule file

`$ node src/run.mjs pkg-info -r rules.json`

Alternatively use the rule options directly

`$ node src/run.mjs pkg-info -r rules.json -d 160 -s minor`

If you supply both types of rules, the options override any rule in the the rules file (overide `maxDays` in `rules.json`)

`$ node src/run.mjs pkg-info -r rules.json -d 160` 

## Generate XLS (Excel) report

```bash
$ node src/run.mjs xls-report report.json

Generating XLS report file for: report.json
Writing to file: report_2021-12-09.json
Done :)
```
