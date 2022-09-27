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
  const { names, filter } = opts;
  const promises = Object.entries(packageObjs).map(
    async ([packageName, version]) => {
      const pkgInfo = await getInfo(packageName, version, opts);
      return pkgInfo;
    }
  );
  let packages = await Promise.all(promises);
  // if filter enabled, return only the packages that are invalid
  packages = filter ? packages.filter((pkg) => pkg.invalid) : packages;
  if (names) {
    return packages.map((pkg) => pkg.name).join(",");
  }
  return packages;
};
