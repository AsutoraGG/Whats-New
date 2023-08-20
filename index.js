/* Build => esbuild index.js --bundle --platform=node --target=node18  --outfile=out.js */
import { _print, Title, formatSize, FileNumber } from './src/util.js';
import { getChanges } from './src/file.js'
import { config } from './src/conf.js';

import path from 'path';
import { readFileSync, readdirSync, statSync, writeFileSync } from "fs"

import Table from 'cli-table'
import inquirer from 'inquirer';

let folderpath = "C:\\Game\\Tarkov"
/* ──────────────────────────────────────────────────────────────────── */
function isExcludedFolder(folderName) {
    const excludedFolders = ['Culling_Data', 'Logs', 'MonoBleedingEdge', 'cache', 'BattlEye', 'NLog', "temp", "cfg", "EasyAntiCheat", "ThirdParty"];
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
      } else if (stats.isDirectory() && !isExcludedFolder(file) && !file.includes(".bytes")) {
        result[file] = saveFileSize(filePath);
      }
    });

    return result
};

function savetoJson(object, number) {
  writeFileSync(`./src/save/${number}.json`, JSON.stringify(object, null, 2));
}

function settings() {
  inquirer.prompt([
    {
      name: "config1",
      type: "list",
      message: "Showing Created Files: ",
      choices: ["Enable", "Disable"]
    },
    {
      name: "config2",
      type: "list",
      message: "Showing Deleted Files: ",
      choices: ["Enable", "Disable"]
    },
    {
      name: "config3",
      type: "list",
      message: "Showing - Files: ",
      choices: ["Enable", "Disable"]
    },
    {
      name: "config5",
      type: "list",
      message: "Showing + Files: ",
      choices: ["Enable", "Disable"]
    },
    {
      name: "config7",
      type: "list",
      message: "Only showing 1MB or more",
      choices: ["Enable", "Disable"]
    },
    {
      name: "config4",
      type: "list",
      message: "Select Wich Using Language in this program: ",
      choices: ["Japanese", "English"]
    },
    {
      name: "config6",
      type: "list",
      message: "Don't save new data(Not Recommend!)",
      choices: ["Enable", "Disable"]
    }
  ]).then(answer => {
    config.EnableCreated    = (answer.config1 === "Enable" ? true : false)
    config.EnableDeleted    = (answer.config2 === "Enable" ? true : false)
    config.Enabledecrease   = (answer.config3 === "Enable" ? true : false)
    config.EnableIncreased  = (answer.config5 === "Enable" ? true : false)
    config.japanese         = (answer.config4 === "Japanese" ? true : false)
    config.DontSaveNewData  = (answer.config6 === "Enable" ? true : false)
    config.EnableOnlyMB     = (answer.config7 === "Enable" ? true : false)
    console.clear()
    _print('info', "Saved Settings(One Time)", "設定を保存しました")
    Title()
    start()
  })
}

function start() {
  inquirer.prompt([
    {
      name: "programlist",
      type: "list",
      message: "Select which program to check: ",
      choices: ["[1]: Tarkov", "[2]: Rust", "[3]: Valorant", "[4]: Back to Settings"]
    }
  ]).then(answer => {
    answer = answer.programlist
    console.clear()
    Title();

    if(answer.includes("[1]")) {
      console.clear()
      folderpath = "C:\\Game\\Tarkov"
      main(FileNumber.tarkov, "Tarkov")
    } else if(answer.includes("[2]")) {
      console.clear()
      folderpath = "C:\\SteamLibrary\\steamapps\\common\\Rust" 
      main(FileNumber.Rust, "Rust")
    } else if(answer.includes("[3]")){
      console.clear()
      folderpath = "D:\\Valorant\\Riot Games\\VALORANT\\live"
      main(FileNumber.Valorant, "Valorant")
    } else if(answer.includes("[4]")){
      console.clear();
      settings()
    }
  })
}

async function main(number, softwareName) {
  Title()
  //console.log("Enabledecrease: " + config.Enabledecrease, "EnableIncreased: " + config.EnableIncreased, "EnableDeleted: " + config.EnableDeleted, "EnableCreated:"+ config.EnableCreated)
  let OldData = await JSON.parse(readFileSync(`./src/save/${number}.json`));

  if(config.DontSaveNewData === false) {
    savetoJson(saveFileSize(folderpath), number)
  }
  let LatestData;

  if (Object.keys(OldData).length === 0) {
    _print("info", "No Update! because it's first time! try please later!", "更新はありません!これは初回起動だからです!あとでもう一度試してみてください")
    process.exit()
  }

  if(config.DontSaveNewData === false) {
    LatestData = JSON.parse(readFileSync(`./src/save/${number}.json`));
  } else {
    LatestData = saveFileSize(folderpath)
  }

  const WhatNew = await getChanges(OldData, LatestData);

  let deletedCount = 0
  let createdCount = 0
  let increasedSize= 0
  let decreaseSize = 0

  if (!(WhatNew.length > 0)) {
    _print("info", 'No Update on ' + softwareName + "!", softwareName + "に更新は確認されませんでした!")
    setTimeout(() => {
      start()
    }, 3000)
  } else {
    var updateListTable = new Table({
      head: ["\x1b[33mFilePath (\x1b[35m" + folderpath + "\x1b[33m)", "\x1b[32mChanged Amount", "\x1b[34mFinal Size"],
      style: {
        compact: true
      }
    })
    _print('info', "Update Detected!", "更新が確認されました!")

    WhatNew.forEach((data) => {
      if (!data.hasOwnProperty("isDeleted")) {
        updateListTable.push(
          [
          data.path.includes("exe") ? "\x1b[35m" + data.path + "\x1b[0m" : data.path,
          (data.changeSymbol === "+" ? (() => { increasedSize += data.changeAmount; return "\x1b[46m\x1b[30m" + "+" + formatSize(data.changeAmount)})() : (() => {decreaseSize += data.changeAmount; return "\x1b[45m\x1b[30m" + "-" + formatSize(data.changeAmount)})()) + "\x1b[0m",
          (formatSize(data.finalAmount).toString() === "NaN undefined" ? "Error!" : formatSize(data.finalAmount))
          ]
        )
      } else {
        updateListTable.push(
          [
            data.path.includes("exe") ? "\x1b[35m" + data.path + "\x1b[0m" : data.path,
            (data.changeSymbol === "+" ? (() => { createdCount += 1; increasedSize += data.finalAmount; return "\x1b[42m\x1b[30m" + "was Created!"; })() : (() => { deletedCount += 1; decreaseSize += data.finalAmount; return "\x1b[41m\x1b[30m" + "was Deleted!"; })()) + "\x1b[0m",
            (formatSize(data.finalAmount).toString() === "NaN undefined" ? "Error!" : formatSize(data.finalAmount))
          ]
        )
      }
    });
    console.log(updateListTable.toString());

    var resultTable = new Table({
      head: [`\x1b[37mA total of \x1b[31m\x1b[1m${WhatNew.length}\x1b[0m\x1b[37m files have been updated`, `\x1b[37mCreated \x1b[31m\x1b[1m${config.EnableCreated === true? createdCount : "(Not Enabled)"}\x1b[0m\x1b[37m and Deleted \x1b[31m\x1b[1m${config.EnableDeleted === true ? deletedCount : "(Not Enabled)"} \x1b[37m\x1b[0mfiles`, `\x1b[1m+${formatSize(increasedSize)} \x1b[0m\x1b[37mand\x1b[31m\x1b[1m -${formatSize(decreaseSize)}\x1b[0m`]
    })

    console.log(resultTable.toString())
    setTimeout(() => {
      start()
    }, 3000) 
  };
}

/* ──────────────────────────────────────────────────────────────────── */
Title()
settings()