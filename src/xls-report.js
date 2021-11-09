import json2xls from 'json2xls';

function formatDate(date) {
  const d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

export const createXlsReport = (filePath, reportName = 'report') => {
  reportName = reportName + '_' + formatDate(new Date());
  const content = fs.readFileSync(filePath)
  const json = JSON.parse(content)
  const xls = json2xls(json);
  console.log(`Writing to ${reportName}`)
  fs.writeFileSync(`${reportName}.xlsx`, xls, 'binary');
  console.log(`Done :)`)
}

