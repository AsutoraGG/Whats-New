export function getChanges(originalJSON, newJSON, path = '') {
  const changes = [];

  const originalKeys = Object.keys(originalJSON);
  const newKeys = Object.keys(newJSON);
  const allKeys = Array.from(new Set([...originalKeys, ...newKeys]));
  const addedKeys = newKeys.filter((key) => !originalKeys.includes(key));
  const deletedKeys = originalKeys.filter((key) => !newKeys.includes(key));

  for (const key of allKeys) {
    const newPath = path ? `${key}` : key;
    const originalValue = originalJSON[key];
    const newValue = newJSON[key];

    if (typeof originalValue === 'object' && typeof newValue === 'object') {
      const nestedChanges = getChanges(originalValue, newValue, newPath);
      changes.push(...nestedChanges);
    } else if (originalValue !== newValue) {
      const change = {}

      if (typeof originalValue === 'number' && typeof newValue === 'number') {
        if (newValue - originalValue < 0) {
          change.path         = newPath
          change.changeAmount = Math.abs(newValue - originalValue);
          change.changeSymbol = "-";
        } else {
          change.path         = newPath
          change.changeAmount = newValue - originalValue;
          change.changeSymbol = "+";
        }
        changes.push(change);
      }
    }
  }

  addedKeys.forEach((key) => {
    const newPath = path ? `${key}` : key;
    const change = {
      path: newPath,
      changeSymbol: "+",
      isDeleted: false,
    };
    changes.push(change);
  });

  deletedKeys.forEach((key) => {
    const newPath = path ? `${key}` : key;
    const change = {
      path: newPath,
      changeSymbol: "-",
      isDeleted: true, 
    };
    changes.push(change);
  });

  return changes;
}