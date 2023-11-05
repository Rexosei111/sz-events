export function clipText(text, size) {
  if (typeof text === "undefined") {
    return null;
  }
  const words = text.split(" ");
  if (words.length > size) {
    const clippedText = words.slice(0, size).join(" ") + "...";
    return clippedText;
  } else {
    return text;
  }
}

export function removeNullStrings(inputString) {
  if (typeof inputString !== "string") {
    return inputString;
  }

  return inputString.split("null").join("");
}

export function formatLocation(inputString) {
  return;
}
