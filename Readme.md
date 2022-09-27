<!-- vscode-markdown-toc -->

- 1. [Dependencies report](#Dependenciesreport)
- 2. [Usage](#Usage)
- 3. [Generate report](#Generatereport)
- 4. [Run against rules](#Runagainstrules)
  - 4.1. [Package category rules](#Packagecategoryrules)
  - 4.2. [Package specific rules](#Packagespecificrules)
- 5. [Generate XLS (Excel) report](#GenerateXLSExcelreport)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

# Repo package version info

This CLI tool can be run on a project `package.json` file to generate package dependency reports.

It can also be used to determine which dependencies break pre-defined rules and need to be updated.

## 1. <a name='Dependenciesreport'></a>Dependencies report

The default dependencies report contains the following information:

```json
{
  "name": "got",
  "version": "11.8.2",
  "versionDate": "2021-2-26",
  "semVerDiff": "major",
  "versionDiff": "1.0.0",
  "majorDiff": 1,
  "minorDiff": 0,
  "patchDiff": 0,
  "latestVersion": "12.3.1",
  "latestVersionDate": "2022-8-6",
  "daysBehindLatestVersion": 526,
  "invalid": true
}
```

If run with `--verbose` setting you can additionally get the following information (versions are last 5 versions published)

```json
{
  "description": "yargs the modern, pirate-themed, successor to optimist.",
  "license": "MIT",
  "homepage": "https://yargs.js.org/",
  "author": "bcoe, oss-bot",
  "versions": ["17.1.0", "17.1.1-candidate.0"]
}
```

If run with `--names` you get only the names

```json
["got", "yargs"]
```

This is useful combined with [run against rules](#Runagainstrules) and `--filter` to output the list of packages that break the rules.

You can then use tools like [jq](https://stedolan.github.io/jq/) to parse the JSON and handle it as needed, such as in the early stage of a CI pipeline to notify relevant parties, abort the pipeline etc.

## 2. <a name='Usage'></a>Usage

Usage help

```bash
$ node src/run.mjs --help

Commands:
  run.mjs pkg-info [pkgfile]  fetch package info from package.json file

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  -v, --verbose  Verbose package info                                  [boolean]

  -o, --output   Output file to store the report                       [string]
  -n, --names    Output only package names                             [boolean]

  -f, --filter   Apply rules filter to only output invalid packages    [boolean]
  -r, --rules    Path to rules file                                    [string]
  -s, --maxSVD   maximum semver diff such as: minor                    [string]
  -d, --maxDays  maximum number of days since last release             [string]
  --maxPatchDiff maximum patch versions behind                         [string]
  --maxMinorDiff maximum minor versions behind                         [string]
  --maxMajorDiff maximum major versions behind                         [string]
```

Print basic report

```bash
$ node src/run.mjs pkg-info package.json

Processing: package.json
[
  {
    "name": "got",
    "version": "11.8.2",
    "versionDate": "2021-2-26",
    "semVerDiff": "major",
    "versionDiff": "1.0.0",
    "majorDiff": 1,
    "minorDiff": 0,
    "patchDiff": 0,
    "latestVersion": "12.4.1",
    "latestVersionDate": "2022-9-2",
    "daysBehindLatestVersion": 553,
    "invalid": false
  },
]
```

## 3. <a name='Generatereport'></a>Generate report

Generate and store basic report using the `--output` (`-o`) flag

```bash
$ node src/run.mjs pkg-info package.json --output report.json

Processing: package.json
Writing to file: report.json
Done :)
```

Generate and store verbose report using the `--verbose` (`-v`) flag

```bash
$ node src/run.mjs pkg-info package.json --verbose --output report.json

Processing: package.json
Writing to file: report.json
Done :)
```

## 4. <a name='Runagainstrules'></a>Run against rules

Create a rules file such as:

```json
{
  "maxSVD": "minor",
  "maxDays": 180,
  "maxMinorDiff": 2
}
```

This rule file says that if a package version is either:

- more than 2 minor versions behind (`maxMinorDiff`)
- at least one minor version (`maxSVD: "minor"`) and `180` days behind latest release (ie. `maxDays`)

Then the package will be marked as `invalid` in the output.

Then rule with the `-r` option pointing to the rule file

`$ node src/run.mjs pkg-info -r rules.json`

Alternatively use the rule options directly

`$ node src/run.mjs pkg-info -r rules.json -d 160 -s minor`

If you supply both types of rules, the options override any rule in the the rules file (overide `maxDays` in `rules.json`)

`$ node src/run.mjs pkg-info -r rules.json -d 160`

With rules the `invalid` entry will be `true` or `false` depending on whether the package entry is within the constraints defined by the rules.

```bash
 [
[
  {
    "name": "diff-dates",
    "version": "1.0.14",
    "versionDate": "2021-3-2",
    "versionDiff": "0.0.0",
    "majorDiff": 0,
    "minorDiff": 0,
    "patchDiff": 0,
    "latestVersion": "1.0.14",
    "latestVersionDate": "2021-3-2",
    "daysBehindLatestVersion": 0,
    "invalid": false
  },
  {
    "name": "got",
    "version": "11.8.2",
    "versionDate": "2021-2-26",
    "semVerDiff": "major",
    "versionDiff": "1.0.0",
    "majorDiff": 1,
    "minorDiff": 0,
    "patchDiff": 0,
    "latestVersion": "12.4.1",
    "latestVersionDate": "2022-9-2",
    "daysBehindLatestVersion": 553,
    "invalid": false
  },
 ]
```

In the above output, we can see that the package `got` has a `semVerDiff` of `major` which means it is a `major` sem version behind and more than `180` days (here `526`) behind latest release. Therefore `invalid` for `got` is marked as `false`

### 4.1. <a name='Packagecategoryrules'></a>Package category rules

You may also define package rule categories. Here we specify a set of `core` packages (`react` and `redux`) as entries in `categories.list` that all share the same package category rule as entries under `categories.rules`.

```json
{
  "maxSVD": "minor",
  "maxDays": 180,
  "maxMinorDiff": 3,
  "categories": {
    "rules": {
      "core": {
        "maxDays": 90,
        "maxMinorDiff": 2
      }
    },
    "lists": {
      "core": ["react", "redux"]
    }
  }
}
```

### 4.2. <a name='Packagespecificrules'></a>Package specific rules

You can add a `packages` entry to the rules file to set package specific rules that override default and category rules.

```json
{
  "maxSVD": "minor",
  "maxDays": 180,
  "maxMinorDiff": 3,
  "packages": {
    "react": {
      "maxDays": 90,
      "maxMinorDiff": 2
    }
  }
}
```

## 5. <a name='GenerateXLSExcelreport'></a>Generate XLS (Excel) report

The dependencies report `.json` file can be exported to an `.xslx` file (for Excel) using the `xls-report` command.

```bash
$ node src/run.mjs xls-report report.json

Generating XLS report file for: report.json
Writing to file: report_2021-12-09.json
Done :)
```
