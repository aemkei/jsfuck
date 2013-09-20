/*! JSFuck 0.3.0 - http://jsfuck.com */

(function(self){

  var USE_CHAR_CODE = "USE_CHAR_CODE";

  var MIN = 32, MAX = 126;

  var SIMPLE = {
    'false':      '![]',
    'true':       '!![]',
    'undefined':  '[][[]]',
    'NaN':        '+[![]]',
    'Infinity':   '+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]]+[+[]])' // +"1e1000"
  };

  var CONSTRUCTORS = {
    'Array':    '[]',
    'Number':   '+[]',
    'String':   '[]+[]',
    'Boolean':  '![]',
    'Function':  '[]["filter"]'
  };

  var MAPPING = {
    'a':   '("false")[1]',
    'b':   '(+(11))["toString"](20)',
    'c':   '([]["filter"]+"")[3]',
    'd':   '("undefined")[2]',
    'e':   '("true")[3]',
    'f':   '("false")[0]',
    'g':   '(+false+[false]+String)[20]',
    'h':   '(+(17))["toString"](20)',
    'i':   '([false]+undefined)[10]',
    'j':   '(+(19))["toString"](20)',
    'k':   '(+(20))["toString"](21)',
    'l':   '("false")[2]',
    'm':   '(Number+"")[11]',
    'n':   '("undefined")[1]',
    'o':   '(true+[]["filter"])[10]',
    'p':   '(+(25))["toString"](30)',
    'q':   '(+(26))["toString"](30)',
    'r':   '("true")[1]',
    's':   '("false")[3]',
    't':   '("true")[0]',
    'u':   '("undefined")[0]',
    'v':   '(+(31))["toString"](32)',
    'w':   '(+(32))["toString"](33)',
    'x':   '(+(33))["toString"](34)',
    'y':   '(NaN+[Infinity])[10]',
    'z':   '(+(35))["toString"](36)',

    'A':   '(+false+Array)[10]',
    'B':   '(+false+Boolean)[10]',
    'C':   'GLOBAL["escape"]("<")[2]',
    'D':   'GLOBAL["escape"]("=")[2]',
    'E':   'GLOBAL["escape"](">")[2]',
    'F':   '(+false+Function)[10]',
    'G':   USE_CHAR_CODE,
    'H':   USE_CHAR_CODE,
    'I':   '("Infinity")[0]',
    'J':   USE_CHAR_CODE,
    'K':   USE_CHAR_CODE,
    'L':   USE_CHAR_CODE,
    'M':   USE_CHAR_CODE,
    'N':   '("NaN")[0]',
    'O':   USE_CHAR_CODE,
    'P':   USE_CHAR_CODE,
    'Q':   USE_CHAR_CODE,
    'R':   USE_CHAR_CODE,
    'S':   '(+false+String)[10]',
    'T':   USE_CHAR_CODE,
    'U':   USE_CHAR_CODE,
    'V':   USE_CHAR_CODE,
    'W':   USE_CHAR_CODE,
    'X':   USE_CHAR_CODE,
    'Y':   USE_CHAR_CODE,
    'Z':   USE_CHAR_CODE,

    ' ':   '(NaN+[]["filter"])[11]',
    '!':   USE_CHAR_CODE,
    '"':   '("")["fontcolor"]()[12]',
    '#':   USE_CHAR_CODE,
    '$':   USE_CHAR_CODE,
    '%':   'GLOBAL["escape"]("<")[0]',
    '&':   USE_CHAR_CODE,
    '\'':  USE_CHAR_CODE,
    '(':   '(false+[]["filter"])[20]',
    ')':   '(true+[]["filter"])[20]',
    '*':   USE_CHAR_CODE,
    '+':   '(+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]])+[])[2]',
    ',':   '[[]]["concat"]([][[]])+""',
    '-':   '(+(.0000000001)+"")[2]',
    '.':   '(+(+!+[]+[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+[!+[]+!+[]]+[+[]])+[])[+!+[]]',
    '/':   '(false+[+false])["italics"]()[10]',
    ':':   'GLOBAL["Date"]()[21]',
    ';':   USE_CHAR_CODE,
    '<':   '("")["italics"]()[0]',
    '=':   '("")["fontcolor"]()[11]',
    '>':   '("")["italics"]()[2]',
    '?':   USE_CHAR_CODE,
    '@':   USE_CHAR_CODE,
    '[':   '(GLOBAL+"")[0]',
    '\\':  USE_CHAR_CODE,
    ']':   USE_CHAR_CODE,
    '^':   USE_CHAR_CODE,
    '_':   USE_CHAR_CODE,
    '`':   USE_CHAR_CODE,
    '{':   '(NaN+[]["filter"])[21]',
    '|':   USE_CHAR_CODE,
    '}':   USE_CHAR_CODE,
    '~':   USE_CHAR_CODE
  };

  var GLOBAL = '[]["filter"]["constructor"]("return this")()';

  function fillMissingChars(){
    for (var key in MAPPING){
      if (MAPPING[key] === USE_CHAR_CODE){
        MAPPING[key] = 'GLOBAL["unescape"]("%"'+ key.charCodeAt(0).toString(16).replace(/(\d+)/g, "+($1)+\"") + '")';
      }
    }
  }

  function fillMissingDigits(){
    var output, number, i;

    for (number = 0; number < 10; number++){

      output = "+[]";

      if (number > 0){ output = "+!" + output; }
      for (i = 1; i < number; i++){ output = "+!+[]" + output; }
      if (number > 1){ output = output.substr(1); }

      MAPPING[number] = "[" + output + "]";
    }
  }

  function replaceMap(){
    var character = "", value, original, i, key;

    function replace(pattern, replacement){
      value = value.replace(
        new RegExp(pattern, "gi"),
        replacement
      );
    }

    for (i = MIN; i <= MAX; i++){
      character = String.fromCharCode(i);
      value = MAPPING[character];
      original = value;

      for (key in CONSTRUCTORS){
        replace("\\b" + key, '(' + CONSTRUCTORS[key] + ')["constructor"]');
      }

      for (key in SIMPLE){
        replace('"' + key + '"', SIMPLE[key] + "+[]");
        replace(key, SIMPLE[key]);
      }

      for (key = 0; key < 10; key++){
        replace(key, "+[" + MAPPING[key] + "]");
      }

      replace("GLOBAL", GLOBAL);
      replace('\\+""', "+[]");
      replace('""', "[]+[]");

      MAPPING[character] = value;
    }
  }

  function replaceStrings(){
    var regEx = /[^\[\]\(\)\!\+]{1}/g,
      all, value, missing,
      count = MAX - MIN;

    function findMissing(){
      var all, value, done = false;

      missing = {};

      for (all in MAPPING){

        value = MAPPING[all];

        if (value.match(regEx)){
          missing[all] = value;
          done = true;
        }
      }

      return done;
    }

    function mappingReplacer(a, b){
      return b.split("").join("+");
    }

    function valueReplacer(c) {
      return missing[c] ? c : MAPPING[c];  
    }

    for (all in MAPPING){
      MAPPING[all] = MAPPING[all].replace(/\"([^\"]+)\"/gi, mappingReplacer);
    }

    while (findMissing()){
      for (all in missing){
        value = MAPPING[all];
        value = value.replace(regEx, valueReplacer);

        MAPPING[all] = value;
        missing[all] = value;
      }

      if (count-- === 0){
        console.error("Could not compile the following chars:", missing);
      }
    }
  }

  function encode(input, wrapWithEval){
    var output = [];

    if (!input){
      return "";
    }

    input.replace(/./g, function(c){

      var replacement = MAPPING[c];

      if (replacement){
        output.push(MAPPING[c]); 
      } else {

        replacement =
          "([]+[])[" + encode("constructor") + "]" +
          "[" + encode("fromCharCode") + "]" +
          "(" + encode(c.charCodeAt(0) + "") + ")";
 
        output.push(replacement);
        MAPPING[c] = replacement;
      }
    });

    output = output.join("+");

    if (/^\d$/.test(input)){
      output += "+[]";
    }

    if (wrapWithEval){
      output = "[][" + encode("filter") + "]" +
        "[" + encode("constructor") + "]" +
        "(" + output + ")()";
    }

    return output;
  }

  fillMissingDigits();
  fillMissingChars();
  replaceMap();
  replaceStrings();

  self.JSFuck = {
    encode: encode
  };
})(typeof(exports) === "undefined" ? window : exports);
