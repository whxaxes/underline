'use strict';
const nlRE = /\r?\n/g;
const DEFAULT_PATTERN = '^';
const DEFAULT_DISTANCE = 3;
const DEFAULT_PADDING = 8;
const DEFAULT_MARGIN = 0;

module.exports = function(str, start, end, distance, pattern) {
  const lastArg = arguments[arguments.length - 1];
  const options = typeof lastArg === 'object' ? lastArg : {};
  str = getValue(options, 'str', str);
  pattern = getValue(options, 'pattern', pattern, DEFAULT_PATTERN);
  start = getValue(options, 'start', start);
  end = getValue(options, 'end', end);
  distance = getValue(options, 'distance', distance, DEFAULT_DISTANCE);
  const padding = getValue(options, 'padding', DEFAULT_PADDING);
  const margin = getValue(options, 'margin', DEFAULT_MARGIN);
  const startDis = getValue(options, 'startDis', distance);
  const endDis = getValue(options, 'endDis', distance);
  const showNumber = getValue(options, 'showNumber', true);
  const showAll = distance === false;

  let matches;
  let lastIndex = 0;
  let lineCount = 0;
  let lineNumber = null;
  let columnNumber = null;
  let endLineNumber = null;
  let endColumnNumber = null;
  let stringList = [];
  let startDrawLine = false;
  let endDrawLine = false;
  let isEnd = false;

  while ((matches = nlRE.exec(str)) || !isEnd) {
    if (isEnd) {
      break;
    }

    lineCount++;
    const matchIndex = matches ? matches.index : str.length;
    const nlLen = matches ? matches[0].length : 0;
    isEnd = !matches;
    const number = showNumber ? String(lineCount) : '';
    const leftString = getSerialStr(margin, ' ')
      + number
      + getSerialStr(padding - number.length, ' ');
    stringList.push(leftString + str.substring(lastIndex, matchIndex));

    // draw line index
    let startIndex = lastIndex;
    let endIndex = matchIndex;

    // start draw underline
    if (start >= lastIndex && start <= matchIndex) {
      lineNumber = lineCount;
      columnNumber = start - lastIndex;
      startIndex = start;
      startDrawLine = true;
    }

    // end draw underline
    if (end >= lastIndex && end <= matchIndex) {
      endLineNumber = lineCount;
      endColumnNumber = end - lastIndex;
      endIndex = end;
      endDrawLine = true;
    }

    // draw line
    if (startDrawLine) {
      stringList.push(
        getSerialStr(leftString.length + startIndex - lastIndex, ' ') +
        getSerialStr(endIndex - startIndex, pattern)
      );
    }

    // stop draw line if is end
    if (endDrawLine) {
      startDrawLine = false;
    }

    if (!showAll
      && lineNumber !== null
      && endLineNumber !== null
      && lineCount >= lineNumber + endDis) {
      break;
    }

    // update lastIndex
    lastIndex = matchIndex + nlLen;
  }

  // reset regex
  nlRE.lastIndex = 0;

  // calculate slice start
  if (!showAll) {
    let sliceStart = lineNumber - startDis;
    sliceStart = sliceStart < 0 ? 0 : sliceStart;
    stringList = stringList.slice(sliceStart);
  }

  return {
    lineNumber,
    columnNumber: columnNumber + 1,
    endLineNumber,
    endColumnNumber,
    text: stringList.join('\n'),
  };
};

function getValue(obj, key, def, def2) {
  return (obj && obj.hasOwnProperty(key))
    ? obj[key]
    : (def === undefined || typeof def === 'object') ? def2 : def;
}

function getSerialStr(len, str) {
  return new Array(len + 1).join(str);
}
