import { pkgInfo } from './package-info.mjs'
import {readPackage} from 'read-pkg';

const getInfo = async (name, version, opts = {}) => {
  return await pkgInfo(name, version, opts)
}

export const getPkgDependencies = async (pkgFilePath) => {
  const data = await readPackage(pkgFilePath)
  return data.dependencies;
}

export const fetch = async (packageObjs, opts = {}) => {
  const promises = Object.entries(packageObjs).map(async ([packageName, version]) => {
    return await getInfo(packageName, version, opts);
  });
  return await Promise.all(promises);  
};
