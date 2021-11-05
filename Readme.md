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
    name: 'got',
    version: '^11.8.2',
    versionDate: '2021-2-26',
    latestVersion: '11.8.2',
    latestVersionDate: '2021-2-26',
    daysBehindLatestVersion: 0
  },
  {
    name: 'read-pkg',
    version: '^6.0.0',
    versionDate: '2021-3-28',
    latestVersion: '7.0.0',
    latestVersionDate: '2021-8-15',
    daysBehindLatestVersion: 13
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
