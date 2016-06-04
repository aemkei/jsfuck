/*! JSFuck 0.4.0 - http://jsfuck.com */

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
    'Number':   '(+[])',
    'String':   '([]+[])',
    'Boolean':  '(![])',
    'Function': '[]["filter"]',
    'RegExp':   'Function("return/"+false+"/")()'
  };

  var MAPPING = {
    'a':   '(false+"")[1]',
    'b':   '(Function("return{}")()+"")[2]',
    'c':   '([]["filter"]+"")[3]',
    'd':   '(undefined+"")[2]',
    'e':   '(true+"")[3]',
    'f':   '(false+"")[0]',
    'g':   '(false+[0]+String)[20]',
    'h':   '(+(101))["to"+String["name"]](21)[1]',
    'i':   '([false]+undefined)[10]',
    'j':   '(Function("return{}")()+"")[10]',
    'k':   '(+(20))["to"+String["name"]](21)',
    'l':   '(false+"")[2]',
    'm':   '(Number+"")[11]',
    'n':   '(undefined+"")[1]',
    'o':   '(true+[]["filter"])[10]',
    'p':   '(+(211))["to"+String["name"]](31)[1]',
    'q':   '(+(212))["to"+String["name"]](31)[1]',
    'r':   '(true+"")[1]',
    's':   '(false+"")[3]',
    't':   '(true+"")[0]',
    'u':   '(undefined+"")[0]',
    'v':   '(+(31))["to"+String["name"]](32)',
    'w':   '(+(32))["to"+String["name"]](33)',
    'x':   '(+(101))["to"+String["name"]](34)[1]',
    'y':   '(NaN+[Infinity])[10]',
    'z':   '(+(35))["to"+String["name"]](36)',

    'A':   '(+[]+Array)[10]',
    'B':   '(+[]+Boolean)[10]',
    'C':   'Function("return escape")()(("")["italics"]())[2]',
    'D':   'Function("return escape")()([]["filter"])["slice"]("-1")',
    'E':   '(RegExp+"")[12]',
    'F':   '(+[]+Function)[10]',
    'G':   '(false+Function("return Date")()())[30]',
    'H':   USE_CHAR_CODE,
    'I':   '(Infinity+"")[0]',
    'J':   USE_CHAR_CODE,
    'K':   USE_CHAR_CODE,
    'L':   USE_CHAR_CODE,
    'M':   '(true+Function("return Date")()())[30]',
    'N':   '(NaN+"")[0]',
    'O':   '(NaN+Function("return{}")())[11]',
    'P':   USE_CHAR_CODE,
    'Q':   USE_CHAR_CODE,
    'R':   '(+[]+RegExp)[10]',
    'S':   '(+[]+String)[10]',
    'T':   '(NaN+Function("return Date")()())[30]',
    'U':   '(NaN+Function("return{}")()["to"+String["name"]]["call"]())[11]',
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
    '%':   'Function("return escape")()([]["filter"])[20]',
    '&':   '("")["link"](0+")[10]',
    '\'':  USE_CHAR_CODE,
    '(':   '(false+[]["filter"])[20]',
    ')':   '(true+[]["filter"])[20]',
    '*':   USE_CHAR_CODE,
    '+':   '(+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]])+[])[2]',
    ',':   '([]["slice"]["call"](false+"")+"")[1]',
    '-':   '(+(.+[0000000001])+"")[2]',
    '.':   '(+(+!+[]+[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+[!+[]+!+[]]+[+[]])+[])[+!+[]]',
    '/':   '(false+[0])["italics"]()[10]',
    ':':   '(RegExp()+"")[3]',
    ';':   '("")["link"](")[14]',
    '<':   '("")["italics"]()[0]',
    '=':   '("")["fontcolor"]()[11]',
    '>':   '("")["italics"]()[2]',
    '?':   '(RegExp()+"")[2]',
    '@':   USE_CHAR_CODE,
    '[':   '(Function("return{}")()+"")[0]',
    '\\':  USE_CHAR_CODE,
    ']':   '(Function("return{}")()+"")["slice"]("-1")',
    '^':   USE_CHAR_CODE,
    '_':   USE_CHAR_CODE,
    '`':   USE_CHAR_CODE,
    '{':   '(NaN+[]["filter"])[21]',
    '|':   USE_CHAR_CODE,
    '}':   '([]["filter"]+"")["slice"]("-1")',
    '~':   USE_CHAR_CODE
  };

  var GLOBAL = 'Function("return this")()';

  function fillMissingChars(){
    for (var key in MAPPING){
      if (MAPPING[key] === USE_CHAR_CODE){
        MAPPING[key] = 'Function("return unescape")()("%"'+ key.charCodeAt(0).toString(16).replace(/(\d+)/g, "+($1)+\"") + '")';
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

    function digitReplacer(_,x) { return MAPPING[x]; }

    function numberReplacer(_,y) {
      var values = y.split("");
      var head = +(values.shift());
      var output = "+[]";

      if (head > 0){ output = "+!" + output; }
      for (i = 1; i < head; i++){ output = "+!+[]" + output; }
      if (head > 1){ output = output.substr(1); }

      return [output].concat(values).join("+").replace(/(\d)/g, digitReplacer);
    }

    for (i = MIN; i <= MAX; i++){
      character = String.fromCharCode(i);
      value = MAPPING[character];
      if(!value) {continue;}
      original = value;

      for (key in CONSTRUCTORS){
        replace("\\b" + key, CONSTRUCTORS[key] + '["constructor"]');
      }

      for (key in SIMPLE){
        replace(key, SIMPLE[key]);
      }

      replace('(\\d\\d+)', numberReplacer);
      replace('\\((\\d)\\)', digitReplacer);
      replace('\\[(\\d)\\]', digitReplacer);

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

    function mappingReplacer(a, b) {
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

  function encode(input, wrapWithEval, runInParentScope){
    var output = [];

    if (!input){
      return "";
    }

    var r = "";
    for (var i in SIMPLE) {
      r += i + "|";
    }
    r+=".";

    input.replace(new RegExp(r, 'g'), function(c) {
      var replacement = SIMPLE[c];
      if (replacement) {
        output.push("[" + replacement + "]+[]");
      } else {
        replacement = MAPPING[c];
        if (replacement){
          output.push(replacement);
        } else {
          replacement =
            "([]+[])[" + encode("constructor") + "]" +
            "[" + encode("fromCharCode") + "]" +
            "(" + encode(c.charCodeAt(0) + "") + ")";
   
          output.push(replacement);
          MAPPING[c] = replacement;
        }
      }
    });

    output = output.join("+");

    if (/^\d$/.test(input)){
      output += "+[]";
    }

    if (wrapWithEval){
      if (runInParentScope){
        output = "[][" + encode("filter") + "]" +
          "[" + encode("constructor") + "]" +
          "(" + encode("return eval") +  ")()" +
          "(" + output + ")";
      } else {
        output = "[][" + encode("filter") + "]" +
          "[" + encode("constructor") + "]" +
          "(" + output + ")()";
      }
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
