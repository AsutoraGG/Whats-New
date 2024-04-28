/* Build => esbuild index.js --bundle --platform=node --target=node18  --outfile=out.js */
/* to do -> add filter, add save to file */
import { _print, Title, formatSize, FileNumber, clear } from './src/util.js';
import { getChanges } from './src/file.js'
import { config } from './src/conf.js';

import path from 'path';
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "fs"

import Table from 'cli-table'
import inquirer from 'inquirer';
import chalk from 'chalk';

let folderpath = "D:\\Genshin Impact"
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
  inquirer.prompt([/*
    {
      name: "config8",
      type: "input",
      message: "フィルターを使用する場合の文字: "
    },*/
    {
      name: "config1",
      type: "list",
      message: "Show Created Files: ",
      choices: ["Enable", "Disable"]
    },
    {
      name: "config2",
      type: "list",
      message: "Show Deleted Files: ",
      choices: ["Enable", "Disable"]
    },
    {
      name: "config3",
      type: "list",
      message: "Show - Files: ",
      choices: ["Enable", "Disable"]
    },
    {
      name: "config5",
      type: "list",
      message: "Show + Files: ",
      choices: ["Enable", "Disable"]
    },
    {
      name: "config7",
      type: "list",
      message: "Only 1MB or more",
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
    //config.filter           = (answer.config8)
    console.clear()
    _print('info', "Saved Settings(One Time)", "設定を保存しました(一度限り)")
    Title()
    start()
  })
}

function start() {
  inquirer.prompt([
    {
      name: "programlist",
      type: "list",
      message: "Please select which program to check: ",
      choices: ["[1]: Genshin", "[2]: Rust", "[3]: Valorant", "[4]: R6S", "[5]: Back to Settings"]
    }
  ]).then(answer => {
    answer = answer.programlist
    clear()
    Title();

    if(answer.includes("[1]")) {
      folderpath = "D:\\Genshin Impact"
      main(FileNumber.genshin, "Genshin Impact")
    } else if(answer.includes("[2]")) {
      folderpath = "C:\\Steam_SSD\\steamapps\\common\\Rust" // Change Here!
      main(FileNumber.Rust, "Rust")
    } else if(answer.includes("[3]")){
      folderpath = "D:\\Riot Games\\VALORANT\\live"
      main(FileNumber.Valorant, "Valorant")
    } else if(answer.includes("[4]")){
      folderpath = "C:\\Steam_SSD\\steamapps\\common\\Tom Clancy's Rainbow Six Siege"
      main(FileNumber.Siege, "R6S")
    } else {
      settings()
    }
  })
}

async function main(number, softwareName) {
  Title()
  let OldData = await JSON.parse(readFileSync(`./src/save/${number}.json`));

  if(config.DontSaveNewData === false) {
    savetoJson(saveFileSize(folderpath), number)
  }
  let LatestData;

  if (Object.keys(OldData).length === 0) {
    _print("info", "No Update! because it's first time! please try later!", "更新はありません!これは初回起動だからです!あとでもう一度試してみてください")
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
    _print("info", 'Not detected Update in ' + softwareName + "!", softwareName + "に更新は確認されませんでした!")
    setTimeout(() => {
      start()
    }, 3000)
  } else {
    var updateListTable = new Table({
      head: [chalk.magenta("FilePath") + chalk.white.bold(folderpath), chalk.green("Changed Size"), chalk.blue("Final Size")],
      style: {
        compact: true
      }
    })
    _print('info', "Update Detected!", "更新が確認されました!データテーブルを作成しています・・・")
    
    function updateDates(data, isDeleted) {
      if(isDeleted === true) {
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
    }

    WhatNew.forEach((data) => {
      if (!data.hasOwnProperty("isDeleted")) {
        if(config.EnableOnlyMB === true) {
          if(data.finalAmount >= 1000000) {
            updateDates(data, true)
          }
        } else {
          updateDates(data, true)
        }
      } else {
        if(config.EnableOnlyMB === true) {
          if(data.finalAmount >= 1000000) {
            updateDates(data, false)
          }
        } else {
          updateDates(data, false)
        }
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