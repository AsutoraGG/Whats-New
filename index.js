import { _print, Title, formatSize } from './src/util.js';
import { getChanges } from './src/file.js'

import path from 'path';
import { readFileSync, readdirSync, statSync, writeFileSync } from "fs"

import Table from 'cli-table'

let folderpath = "C:\\Game\\Tarkov" /* <─────────────────── Change Here */

/* ──────────────────────────────────────────────────────────────────── */
function isExcludedFolder(folderName) {
    const excludedFolders = ['Logs', 'MonoBleedingEdge', 'cache', 'BattlEye', 'NLog'];
    return excludedFolders.includes(folderName);
}

function saveFileSize(folderPath) {
    const files = readdirSync(folderPath);
  
    const result = {};
  
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const stats = statSync(filePath);
      if (stats.isFile()) {
        result[file] = stats.size;
      } else if (stats.isDirectory() && !isExcludedFolder(file)) {
        result[file] = saveFileSize(filePath);
      }
    });

    return result
};

function savetoJson(object) {
  writeFileSync("./src/save/1.json", JSON.stringify(object, null, 2));
}

/* ──────────────────────────────────────────────────────────────────── */

let OldData = await JSON.parse(readFileSync('./src/save/1.json'));
savetoJson(saveFileSize(folderpath))
let LatestData = JSON.parse(readFileSync('./src/save/1.json'));

Title()

if(!OldData) {
  _print("info", "No Update! because it's first time! please later!")
  process.exit()
}

const WhatNew = getChanges(OldData, LatestData);

//console.log(WhatNew)
// WhatNew.length > 0 更新がない場合がfalse

if(!WhatNew.length > 0) { 
    _print("info", 'No Update!')
    process.exit()
} else {
  var updateListTable = new Table({ head: ["\x1b[33mPATH (\x1b[35m" + folderpath + "\x1b[33m)", "\x1b[32mChanged Amount"], style: { compact: true } })
  _print('info', "Update Detected!")
  console.log("                " +  '─────── Updates List ───────')

  WhatNew.forEach((data) => {
    if(!data.hasOwnProperty("isDeleted")) {
      updateListTable.push(
        [data.path.includes("exe") ? "\x1b[35m" + data.path + "\x1b[0m" : data.path, (data.changeSymbol === "+" ? "\x1b[42m\x1b[30m" + "+" + formatSize(data.changeAmount) : "\x1b[41m\x1b[30m" + "-" + (formatSize(data.changeAmount) === NaN ? "Deleted or Created!" : formatSize(data.changeAmount)))  + "\x1b[0m"]
      )
    } else {
      updateListTable.push(
        [data.path.includes("exe") ? "\x1b[35m" + data.path + "\x1b[0m" : data.path, (data.changeSymbol === "+" ? "\x1b[42m\x1b[30m" + "was Created!" : "\x1b[41m\x1b[30m" + "was Deleted!") + "\x1b[0m"]
      )
    }
  });

  console.log(updateListTable.toString());
  
  var resultTable = new Table({ head: [`\x1b[37mA total of \x1b[31m${WhatNew.length}\x1b[37m files have been updated`]})

  console.log(resultTable.toString()) 
};