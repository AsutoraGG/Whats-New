/* Build => esbuild index.js --bundle --platform=node --target=node18  --outfile=out.js */
import { _print, Title, formatSize, FileNumber } from './src/util.js';
import { getChanges } from './src/file.js'

import path from 'path';
import { readFileSync, readdirSync, statSync, writeFileSync } from "fs"

import Table from 'cli-table'
import inquirer from 'inquirer';

let folderpath = "C:\\Game\\Tarkov"
/* ──────────────────────────────────────────────────────────────────── */
function isExcludedFolder(folderName) {
    const excludedFolders = ['Logs', 'MonoBleedingEdge', 'cache', 'BattlEye', 'NLog', "temp", "cfg", "EasyAntiCheat", "ThirdParty"];
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

function savetoJson(object, number) {
  writeFileSync(`./src/save/${number}.json`, JSON.stringify(object, null, 2));
}

function start() {
  inquirer.prompt([
    {
      name: "programlist",
      type: "rawlist",
      message: "Select which program to check",
      choices: ["Tarkov", "Rust", "Valorant"]
    }
  ]).then(answer => {
    answer = answer.programlist.toLowerCase()
    console.clear()
    Title();

    if(answer === "tarkov") {
      folderpath = "C:\\Game\\Tarkov"
      main(FileNumber.tarkov, "Tarkov")
    } else if(answer === "rust") {
      folderpath = "C:\\SteamLibrary\\steamapps\\common\\Rust" 
      main(FileNumber.Rust, "Rust")
    } else {
      folderpath = "D:\\Valorant\\Riot Games\\VALORANT\\live"
      main(FileNumber.Valorant, "Valorant")
    }
  })
}

async function main(number, softwareName) {
  let OldData = await JSON.parse(readFileSync(`./src/save/${number}.json`));
  savetoJson(saveFileSize(folderpath), number)

  if (Object.keys(OldData).length === 0) {
    _print("info", "No Update! because it's first time! please later!")
    process.exit()
  }

  let LatestData = JSON.parse(readFileSync(`./src/save/${number}.json`));

  const WhatNew = getChanges(OldData, LatestData);

  if (!WhatNew.length > 0) {
    _print("info", 'No Update on ' + softwareName + "!")
    setTimeout(() => {
      start()
    }, 3000)
  } else {
    var updateListTable = new Table({
      head: ["\x1b[33mPATH (\x1b[35m" + folderpath + "\x1b[33m)", "\x1b[32mChanged Amount"],
      style: {
        compact: true
      }
    })
    _print('info', "Update Detected!")
    console.log("                " + '─────── Updates List ───────')

    WhatNew.forEach((data) => {
      if (!data.hasOwnProperty("isDeleted")) {
        updateListTable.push(
          [data.path.includes("exe") ? "\x1b[35m" + data.path + "\x1b[0m" : data.path, (data.changeSymbol === "+" ? "\x1b[42m\x1b[30m" + "+" + formatSize(data.changeAmount) : "\x1b[41m\x1b[30m" + "-" + formatSize(data.changeAmount)) + "\x1b[0m"]
        )
      } else {
        updateListTable.push(
          [data.path.includes("exe") ? "\x1b[35m" + data.path + "\x1b[0m" : data.path, (data.changeSymbol === "+" ? "\x1b[42m\x1b[30m" + "was Created!" : "\x1b[41m\x1b[30m" + "was Deleted!") + "\x1b[0m"]
        )
      }
    });

    console.log(updateListTable.toString());

    var resultTable = new Table({
      head: [`\x1b[37mA total of \x1b[31m${WhatNew.length}\x1b[37m files have been updated`]
    })

    console.log(resultTable.toString())
    setTimeout(() => {
      start()
    }, 3000)
  };
}

/* ──────────────────────────────────────────────────────────────────── */
Title()

start()