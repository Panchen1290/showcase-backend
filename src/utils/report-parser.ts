import excel from 'exceljs';

export interface TableInfo {
  name: string;
  headers: string[];
}

interface TableHeader {
  name: string;
  index: number;
}

export const parseReport = async (
  reportFilePath: string,
  ignoredTabs: string[],
  tables: TableInfo[],
  ignoredTables: string[],
) => {
  const workbook = new excel.Workbook();
  await workbook.xlsx.readFile(reportFilePath);

  const tabsObj = {};
  let tablesObj = {};
  let tabName = '';
  workbook.worksheets.forEach(function (sheet) {
    tabName = sheet.name;
    if (ignoredTabs.includes(tabName)) return;

    let currentTable = '';
    let tableHeaders: TableHeader[] = [];
    let tableObj: object[] = [];
    let skipRow = false;
    sheet.eachRow((row, rowNumber) => {
      if (skipRow) {
        skipRow = false;
        return;
      }
      const firstCell = row.values[1];
      if (ignoredTables.includes(firstCell)) {
        if (tableObj.length > 0) {
          tablesObj[currentTable] = tableObj;
          tableObj = [];
          currentTable = '';
          tableHeaders = [];
        }
        return;
      }
      const table = tables.find((table) => table.name === firstCell);
      if (table) {
        if (tableObj.length > 0) {
          tablesObj[currentTable] = tableObj;
          tableObj = [];
          currentTable = '';
          tableHeaders = [];
        }

        currentTable = table.name;
        tableHeaders = [];
        const headersRow = sheet.getRow(rowNumber + 1).values;
        for (let i = 1; i < +headersRow.length; i++) {
          // console.log("Iterating header row:", i, headersRow[i]);
          if (table.headers.includes(headersRow[i])) {
            tableHeaders.push({
              name: headersRow[i],
              index: i,
            });
          }
        }
        skipRow = true;
        return;
      }
      if (currentTable === '') return;
      const rowValues = row.values;
      const tableRowObj = {};
      tableHeaders.forEach((header) => {
        tableRowObj[header.name] = rowValues[header.index];
      });
      tableObj.push(tableRowObj);
    });
    if (tableObj.length > 0) {
      tablesObj[currentTable] = tableObj;
      tableObj = [];
      currentTable = '';
      tableHeaders = [];
    }
    if (Object.keys(tablesObj).length > 0) {
      tabsObj[tabName] = tablesObj;
      tablesObj = {};
    }
  });
  return tabsObj;
};
