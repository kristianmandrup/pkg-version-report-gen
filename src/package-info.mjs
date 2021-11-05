'use strict';
import got from 'got'
import registryUrl from 'registry-url';
import pkg from 'semver';
import diffDates from "diff-dates";
const { compare, valid } = pkg;

const maintainerNames = (maintainers) => maintainers && maintainers.reduce((acc, maintainer) => {
		acc.push(maintainer.name);
		return acc
	}, []).join(', ')

const excludeKeys = ['modified', 'created']
const versionsFor = (time) => Object.keys(time).filter(key => !excludeKeys.includes(key)).filter(v => v);

const dateFor = (date) => {
	if (!date) return date
	let d = new Date(date);
	return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const sortVersions = (versions, loose = false) => Array.from(versions).filter(x => valid(x)).sort((a, b) => compare(a, b, loose))

export const pkgInfo = (name, version, opts = {}) =>{
	const dayDiff = (date1, date2) => {
		const d1 = new Date(date1)
		const d2 = new Date(date2)
		const days = diffDates(d2, d1, "days");
		return days || 0;
	}
	
	if (typeof name !== 'string') {
		return Promise.reject(new Error('package name required'));
	}
	const fullUrl = [registryUrl(), name.toLowerCase()].join('');
	return got(fullUrl).then(data => {
			const dataParsed = JSON.parse(data.body);
			const name = dataParsed.name || '';
			const time = dataParsed.time || {};
			// const latestVersion = dataParsed[ 'dist-tags' ].latest || '';
			const allVersions = versionsFor(time)
			const sortedVersions = sortVersions(allVersions || [])
			const versions = sortedVersions.slice(-5)
			const latestVersion = sortedVersions[sortedVersions.length - 1];
			const latestVersionDt = time['' + latestVersion]
			const latestVersionDate = dateFor(latestVersionDt)  || '';

			const hasCaret = version.match(/\^/);
			const firstMatchingVersion = hasCaret ? version.slice(1) : version;
			const versionDt = time['' + firstMatchingVersion]
			const versionDate = dateFor(versionDt) || ''			
			const description = dataParsed.description || '';
			const license = dataParsed.license || '';
			const homepage = dataParsed.homepage || ''
			const daysBehindLatestVersion = dayDiff(versionDt, latestVersionDt) || 0;

			const authorName  = dataParsed.author?.name || 
			maintainerNames(dataParsed.maintainers) || '';

			const output = {
				name,
				version,
				versionDate,
				latestVersion,
				latestVersionDate,
				daysBehindLatestVersion
			};
			
			const verboseOutput = {
				// time,
				description,
				license,
				homepage,
				author: authorName,
				versions				
			}

			return opts.verbose ? {...output, ...verboseOutput} : output;
		})
		.catch(function (err) {
			if (err.statusCode === 404) {
				err.message = 'Package doesn\'t exist';
			}

			throw err;
		});
};