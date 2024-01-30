import gradient from 'gradient-string'
import { config } from './conf.js';

function getTime() {
  var t = new Date();
  return "\x1b[35m" + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
}

export function _print(atr, data, ja) {
  atr = atr.toLowerCase();
  if (atr === "info") {
    console.log(getTime() + '\x1b[32m Info  ' + "\x1b[0m: " + (config.japanese === false ? data : ja))
  } else if (atr === "error") {
    console.log(getTime() + '\x1b[31m Error  ' + "\x1b[0m: " + (config.japanese === false ? data : ja))
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
  console.log(gradient.rainbow(`                                        github.com/AsutoraGG/Whats-New\n                              `))
  
}

export function clear() {
  return process.stdout.write('\x1bc')
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
  genshin  : 1,
  Rust    : 2,
  Valorant: 3
}