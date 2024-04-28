import { config } from './conf.js'

export function getChanges(originalJSON, newJSON, path = '') {
  const changes = [];

  const originalKeys = Object.keys(originalJSON);
  const newKeys = Object.keys(newJSON);
  const allKeys = Array.from(new Set([...originalKeys, ...newKeys]));

  for (const key of allKeys) {
    const newPath = path ? `${key}` : key;
    const originalValue = originalJSON[key];
    const newValue = newJSON[key];

    if (typeof originalValue === 'object' && typeof newValue === 'object') {
      const nestedChanges = getChanges(originalValue, newValue, newPath);
      changes.push(...nestedChanges);
    } else if (originalValue !== newValue) {　/* ファイルのサイズが増えたか増えてないかの処理 -> */
      const change = {}
      
      if (typeof originalValue === 'number' && typeof newValue === 'number') {
        if (newValue - originalValue < 0) {
          if(config.Enabledecrease) {
            if(!config.EnableOnlyMB) {
              change.path         = newPath
              change.changeAmount = Math.abs(newValue - originalValue);
              change.finalAmount  = newValue;
              change.changeSymbol = "-";
              changes.push(change);
            } else if(Math.abs(newValue - originalValue) >= 1048576) {
              change.path         = newPath
              change.changeAmount = Math.abs(newValue - originalValue);
              change.finalAmount  = newValue;
              change.changeSymbol = "-";
              changes.push(change);
            }
          }
        } else {
          if(config.EnableIncreased) {
            if(!config.EnableOnlyMB) {
              change.path         = newPath;
              change.changeAmount = newValue - originalValue;
              change.finalAmount  = newValue;
              change.changeSymbol = "+";
              changes.push(change);
            } else if(newValue - originalValue >= 1048576) {
              change.path         = newPath;
              change.changeAmount = newValue - originalValue;
              change.finalAmount  = newValue;
              change.changeSymbol = "+";
              changes.push(change);
            }
          }
        }
      }
    }
  }

  if(config.EnableCreated) { /* ファイルが削除されたか作成されたかの処理 -> */
    const addedKeys = newKeys.filter((key) => !originalKeys.includes(key));
    addedKeys.forEach((key) => {
      const newPath = path ? `${key}` : key;
      const change = {
        path: newPath,
        changeSymbol: "+",
        isDeleted: false,
        finalAmount: newJSON[key]
      };
      changes.push(change);
    });
  }

  if(config.EnableDeleted) {
    const deletedKeys = originalKeys.filter((key) => !newKeys.includes(key));
    deletedKeys.forEach((key) => {
      const newPath = path ? `${key}` : key;
      const change = {
        path: newPath,
        changeSymbol: "-",
        isDeleted: true,
        finalAmount: originalJSON[key]
      };
      changes.push(change);
    });
  }
  return changes;
}