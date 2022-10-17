import { pkgInfo } from "./package-info.mjs";
import * as fs from "fs";

const getInfo = async (name, version, opts = {}) => {
  return await pkgInfo(name, version, opts);
};

export const loadOpts = (rulesFile) => {
  try {
    var content = fs.readFileSync(rulesFile, "utf8");
    return JSON.parse(content);
  } catch (err) {
    return {};
  }
};

export const getPkgDependencies = async (pkgFilePath) => {
  var content = fs.readFileSync(pkgFilePath, "utf8");
  const data = JSON.parse(content);
  return data.dependencies;
};

export const fetch = async (packageObjs, opts = {}) => {
  const { names, pretty, filter } = opts;
  const promises = Object.entries(packageObjs).map(
    async ([packageName, version]) => {
      const pkgInfo = await getInfo(packageName, version, opts);
      return pkgInfo;
    }
  );
  let packages = await Promise.all(promises);
  let invalid = packages.find((p) => p.invalid) ? true : false;
  // if filter enabled, return only the packages that are invalid
  if (filter) {
    packages = packages.filter((pkg) => pkg.invalid);
  }
  if (names) {
    packages = packages.map((pkg) => pkg.name);
  }
  if (pretty) {
    packages = packages.join(",");
  }
  return {
    packages,
    invalid,
  };
};
