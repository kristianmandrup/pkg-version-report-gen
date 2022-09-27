import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as fs from "fs";
import path from "path";

import { getPkgDependencies, fetch } from "./fetch.mjs";
import { createXlsReport } from "./xls-report.mjs";

export const mainFn = (argv) => {
  if (!argv.pkgfile) {
    console.error(`Missing argument with path to package.json file`);
    rerurn;
  }
  if (argv.pkgfile) {
    const getOpts = ({ maxDays, ...opts }) => {
      try {
        return {
          maxDays: maxDays && parseInt(maxDays),
          ...opts,
        };
      } catch (e) {
        return {};
      }
    };

    const { pkgfile, output, rules } = argv;
    console.log(`Processing: ${pkgfile}`);
    (async () => {
      const opts = getOpts(argv);
      const packageObjs = await getPkgDependencies(pkgfile);
      const pkgInfoList = await fetch(packageObjs, {
        verbose: argv.verbose,
        rulesFile: rules,
        ...opts,
      });
      const { names } = opts;
      if (names) {
        if (!pkgInfoList || pkgInfoList === "") {
          console.log(pkgInfoList);
          // success - no output = pkgs too old
          process.exit(0);
        }
        console.log(pkgInfoList);
        // error
        process.exit(0);
      }
      const jsonStr = JSON.stringify(pkgInfoList, null, 2);

      if (output) {
        console.log(`Writing to file: ${output}`);
        try {
          fs.writeFileSync(output, jsonStr, "utf8");
          console.log("Done :)");
        } catch (err) {
          console.error("File write error", err);
          throw err;
        }
      } else {
        console.log(jsonStr);
      }
    })();
  }
};

export const reportFn = (argv) => {
  const { filepath } = argv;
  console.log(`Generating XLS report file for: ${filepath}`);
  createXlsReport(filepath);
};

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
    "xls-report [filepath]",
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
  .option("names", {
    alias: "n",
    type: "boolean",
    description: "Output only package names",
  })
  .option("filter", {
    alias: "f",
    type: "boolean",
    description: "Apply rules filter to only output invalid packages",
  })
  .option("output", {
    alias: "o",
    type: "string",
    description: "Output file to store the report",
  })
  .option("rules", {
    alias: "r",
    type: "string",
    description: "rules file",
  })
  .option("maxSVD", {
    alias: "s",
    type: "string",
    description: "maximum semver diff such as: minor",
  })
  .option("maxDays", {
    alias: "d",
    type: "string",
    description: "maximum number of days since last release",
  })
  .option("maxPatchDiff", {
    type: "string",
    description: "maximum patch versions behind",
  })
  .option("maxMinorDiff", {
    type: "string",
    description: "maximum minor versions behind",
  })
  .option("maxMajorDiff", {
    type: "string",
    description: "maximum major versions behind",
  })

  .parse();
