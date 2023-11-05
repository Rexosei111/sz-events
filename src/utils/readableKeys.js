export function replaceKeysWithReadable(objArray, keyMapping) {
  const newArray = [];

  objArray.forEach((obj) => {
    const newObj = {};

    for (const key in obj) {
      let newKey = key;
      if (newKey === "propertyPath") {
        newKey = obj[newKey];
      }
      if (keyMapping.hasOwnProperty(newKey)) {
        if (key === "propertyPath") {
          newObj["propertyPath"] = keyMapping[newKey];
        } else {
          newObj[keyMapping[newKey]] = obj[key];
        }
      } else {
        newObj[newKey] = obj[newKey];
      }
    }

    newArray.push(newObj);
  });

  return newArray;
}
