import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import * as fs from 'fs'
import path from "path";

import { getPkgDependencies, fetch } from "./fetch.mjs";
import { createXlsReport } from './xls-report.mjs';

export const mainFn = (argv) => {
  if (!argv.pkgfile) {
    console.error(`Missing argument with path to package.json file`)
    rerurn
  }
  if (argv.pkgfile) {
    const { pkgfile, output } = argv
    console.log(`Processing: ${pkgfile}`);
    (async () => {
      const packageObjs = await getPkgDependencies(pkgfile);
      const pkgInfoList = await fetch(packageObjs, { verbose: argv.verbose });

      if (output) {
        console.log(`Writing to file: ${output}`);            
        const json = JSON.stringify(pkgInfoList, null, 2)
        fs.writeFileSync(output, json, 'utf8');
        console.log('Done :)')
      } else {
        console.log(pkgInfoList)
      }          
    })();
  }
}

export const reportFn = (argv) => {
  const { filepath } = argv
  console.log(`Generating XLS report file for: ${filepath}`);
  createXlsReport(filepath)
}

yargs(hideBin(process.argv))
  .command(
    "pkg-info [pkgfile]",
    "fetch package info from package.json file ",
    (yargs) => {
      return yargs.positional("pkgfile", {
        describe: "file path to package.json",
        default: path.join(process.cwd(), "package.json"),
      });
    },
    mainFn
  )
  .command(
    'xls-report [filepath]',
    "generate xls file (Excel) from report json file ",
    (yargs) => {
      return yargs.positional("filepath", {
        describe: "file path to report json file",
        default: path.join(process.cwd(), "report.json"),
      });
    },
    reportFn
  )
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Verbose package info",
  })
  .option("output", {
    alias: "o",
    type: "string",
    description: "Output file to store the report",
  })
  .parse();