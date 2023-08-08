import gradient from 'gradient-string'
import { readFileSync } from 'fs'

const msg = JSON.parse(readFileSync('./src/randomMsg.json', "utf-8"))[Math.floor(Math.random() * 6)];

function getTime() {
  var t = new Date();
  return "\x1b[35m" + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
}

export function _print(atr, data) {
  atr = atr.toLowerCase();
  if (atr === "info") {
    console.log(getTime() + '\x1b[32m Info  ' + "\x1b[0m: " + data)
  } else if (atr === "error") {
    console.log(getTime() + '\x1b[31m Error  ' + "\x1b[0m: " + data)
  }
}

export function Title() {
  console.clear()
  console.log(gradient.morning("                    ██╗    ██╗██╗  ██╗ █████╗ ████████╗███████╗    ███╗   ██╗███████╗██╗    ██╗  "))
  console.log(gradient.morning("                    ██║    ██║██║  ██║██╔══██╗╚══██╔══╝██╔════╝    ████╗  ██║██╔════╝██║    ██║  "))
  console.log(gradient.morning("                    ██║ █╗ ██║███████║███████║   ██║   ███████╗    ██╔██╗ ██║█████╗  ██║ █╗ ██║  "))
  console.log(gradient.morning("                    ██║███╗██║██╔══██║██╔══██║   ██║   ╚════██║    ██║╚██╗██║██╔══╝  ██║███╗██║  "))
  console.log(gradient.morning("                    ╚███╔███╔╝██║  ██║██║  ██║   ██║   ███████║    ██║ ╚████║███████╗╚███╔███╔╝  "))
  console.log(gradient.morning("                     ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝   "))
  console.log(gradient.rainbow(`                                                ${msg}                               `))
}

export function formatSize(bytes,decimalPoint) {
  if(bytes == 0) return '0 Bytes';
  var k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const FileNumber =   {
  tarkov  : 1,
  Rust    : 2,
  Valorant: 3
}