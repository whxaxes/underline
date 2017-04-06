const assert = require('power-assert');
const underline = require('../');
const testStr = `
const perLineList = str.split(nlRE);
const len = perLineList.length;
let i = 0;
let lineCount = 0;
while(i < len) {
  const currentLine = perLineList[i];
  i++;
}
asd

asd
`;

describe('index', () => {
  it('should run without error', () => {
    const start = testStr.indexOf('lineCount');
    const end = testStr.indexOf('perLineList[i]') + 1;
    const result = underline(testStr, {
      start,
      end,
      distance: false,
    });

    assert(result.lineNumber === 5);
    assert(result.columnNumber === 5);
    assert(result.endLineNumber === 7);
    assert(result.endColumnNumber === 23);
    assert(result.text.includes('\n2'));
    assert(result.text.includes(' ^^^^^^^^^^^^^^\n6'));
    assert(result.text.includes(' ^^^^^^^^^^^^^^^^\n7'));
    assert(result.text.includes(' ^^^^^^^^^^^^^^^^^^^^^^^\n8'));
    assert(result.text.includes('\n9'));
  });

  it('should run with default distance without error', () => {
    const start = testStr.indexOf('lineCount');
    const end = testStr.indexOf('perLineList[i]') + 1;
    const result = underline(testStr, {
      start,
      end,
    });

    assert(!result.text.includes('\n9'));
    assert(!result.text.includes('\n2'));
  });

  it('should run with self define area without error', () => {
    const result = underline('aaa{% say %}', 3, 11, {
      margin: 0,
      padding: 0,
      showNumber: false,
    });

    assert(result.lineNumber === 1);
    assert(result.columnNumber === 4);
    assert(result.endLineNumber === 1);
    assert(result.endColumnNumber === 11);
    assert(result.text === 'aaa{% say %}\n   ^^^^^^^^');
  });

  it('should run with self define pattern without error', () => {
    const result = underline('aaa{% say %}', 3, 11, {
      pattern: '~',
    });
    assert(result.text === '1       aaa{% say %}\n           ~~~~~~~~');
  });

  it('should run with all string without error', () => {
    const result = underline('aaa{% say %}\nline2', 0, 12);
    assert(result.text.includes(' ^^^^^^^^^^^^\n2'));
    assert(!result.text.match(/^$/));
  });

  it('should parse single line string without error', () => {
    const result = underline('aaa{% say %}', 3, 11);
    assert(result.lineNumber === 1);
    assert(result.columnNumber === 4);
    assert(result.endLineNumber === 1);
    assert(result.endColumnNumber === 11);
    assert(result.text === '1       aaa{% say %}\n           ^^^^^^^^');
  });

  it('should parse double line string without error', () => {
    const result = underline('abasdb\naaa{% say %}', 10, 19, false);
    assert(result.lineNumber === 2);
    assert(result.columnNumber === 4);
    assert(result.endLineNumber === 2);
    assert(result.endColumnNumber === 12);
    assert(result.text === '1       abasdb\n2       aaa{% say %}\n           ^^^^^^^^^');
  });

  it('should parse string end with nl without error', () => {
    const result = underline('abasdb\naaa{% say %}\n\n', 10, 19, false);
    assert(result.lineNumber === 2);
    assert(result.columnNumber === 4);
    assert(result.endLineNumber === 2);
    assert(result.endColumnNumber === 12);
    assert(result.text === '1       abasdb\n2       aaa{% say %}\n           ^^^^^^^^^\n3       \n4       ');
  });
});