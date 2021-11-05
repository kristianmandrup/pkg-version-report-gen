'use strict';
import got from 'got'
import registryUrl from 'registry-url';

const maintainerNames = (maintainers) => maintainers && maintainers.reduce((acc, maintainer) => {
		acc.push(maintainer.name);
		return acc
	}, []).join(', ')

const excludeKeys = ['modified', 'created']
const versionsFor = (time) => Object.keys(time).filter(key => !excludeKeys.includes(key))

const dateFor = (date) => {
	if (!date) return date
	let d = new Date(date);
	return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export const pkgInfo = (name, version, opts = {}) =>{
	if (typeof name !== 'string') {
		return Promise.reject(new Error('package name required'));
	}
	const fullUrl = [registryUrl(), name.toLowerCase()].join('');
	return got(fullUrl).then(data => {
			const dataParsed = JSON.parse(data.body);
			const name = dataParsed.name || '';
			const time = dataParsed.time || {};
			const latestVersion = dataParsed[ 'dist-tags' ].latest || '';
			const latestVersionDate = dateFor(time['' + latestVersion])  || '';

			const hasCaret = version.match(/^/);
			const firstMatchingVersion = hasCaret ? version.slice(1) : version;

			const versionDate = dateFor(time['' + firstMatchingVersion]) || ''			
			const description = dataParsed.description || '';
			const license = dataParsed.license || '';
			const homepage = dataParsed.homepage || ''
			const versions = versionsFor(time).slice(-5)

			const authorName  = dataParsed.author?.name || 
			maintainerNames(dataParsed.maintainers) || '';

			const output = {
				name,
				version,
				versionDate,
				latestVersion,
				latestVersionDate
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