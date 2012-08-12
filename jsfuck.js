(function(){
  
  var USE_CHAR_CODE = "USE_CHAR_CODE";
  
  var MIN = 32, MAX = 126;
  
  var SIMPLE = {
    'false':      '![]',
    'true':       '!![]',
    'undefined':  '[][[]]',
    'NaN':        '+[![]]',
    'Infinity':   '+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]]+[+[]])'
  };
  
  var CONSTRUCTORS = {
    'Array':    '[]',
    'Number':   '+[]',
    'String':   '[]+[]',
    'Boolean':  '![]',
    'Function':  '[]["sort"]'
  };
  
  var MAPPING = {
    'a':   '("false")[1]',
    'b':   '(GLOBAL+[])[2]',
    'c':   '([]["filter"]+[])[3]',
    'd':   '("undefined")[2]',
    'e':   '("true")[3]',
    'f':   '("false")[0]', 
    'g':   '([]+String)[14]',
    'h':   '(+(17))["toString"](18)',
    'i':   '("undefined")[5]',
    'j':   '(GLOBAL+"")[3]',
    'k':   '(+(20))["toString"](21)',
    'l':   '("false")[2]',
    'm':   '(Number+"")[11]',
    'n':   '("undefined")[1]',
    'o':   '([]["filter"]+"")[6]',
    'p':   '(+(25))["toString"](30)',
    'q':   '(+(26))["toString"](30)',
    'r':   '("true")[1]',
    's':   '("false")[3]',
    't':   '("true")[0]',
    'u':   '("undefined")[0]',
    'v':   '(+(31))["toString"](32)',
    'w':   '(+(32))["toString"](33)',
    'x':   '(+(33))["toString"](34)',
    'y':   '("Infinity")[7]',
    'z':   '(+(35))["toString"](36)',
    
    'A':   '(Array+"")[9]',
    'B':   '(Boolean+"")[9]',
    'C':   'Function("return \'\\\\"+(103)+"\'")()',
    'D':   USE_CHAR_CODE,
    'E':   USE_CHAR_CODE,
    'F':   '(Function+"")[9]',
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
    'S':   '(String+[])[9]',
    'T':   USE_CHAR_CODE,
    'U':   USE_CHAR_CODE,
    'V':   USE_CHAR_CODE,
    'W':   USE_CHAR_CODE,
    'X':   USE_CHAR_CODE,
    'Y':   USE_CHAR_CODE,
    'Z':   USE_CHAR_CODE,
    
    ' ':   '([]["filter"]+[])[8]',
    '!':   USE_CHAR_CODE,
    '"':   '("")["link"]()[8]',
    '#':   USE_CHAR_CODE,
    '$':   USE_CHAR_CODE,
    '%':   'GLOBAL["escape"]("<")[0]',
    '&':   USE_CHAR_CODE,
    '\'':  USE_CHAR_CODE,
    '(':   '([]["filter"]+"")[15]',
    ')':   '([]["filter"]+"")[16]',
    '*':   USE_CHAR_CODE,
    '+':   USE_CHAR_CODE,
    ',':   USE_CHAR_CODE,
    '-':   USE_CHAR_CODE,
    '.':   USE_CHAR_CODE,
    '/':   '("")["sub"]()[6]',
    ':':   'GLOBAL["Date"]()[21]',
    ';':   USE_CHAR_CODE,
    '<':   '("")["sub"]()[0]',
    '=':   '("")["fontcolor"]()[11]',
    '>':   '("")["sub"]()[10]',
    '?':   USE_CHAR_CODE,
    '@':   USE_CHAR_CODE,
    '[':   USE_CHAR_CODE,
    '\\':  'GLOBAL["unescape"]("%"+(5)+"c")[0]',
    ']':   USE_CHAR_CODE,
    '^':   USE_CHAR_CODE,
    '_':   USE_CHAR_CODE,
    '`':   USE_CHAR_CODE,
    '{':   '([]["filter"]+"")[18]',
    '|':   USE_CHAR_CODE,
    '}':   USE_CHAR_CODE,
    '~':   USE_CHAR_CODE
  };
  
  var GLOBAL = '[]["sort"]["constructor"]("return this")()';
  
  function fillMissingChars(){
    for (var key in MAPPING){
      if (MAPPING[key] === USE_CHAR_CODE){
        MAPPING[key] = 'String["fromCharCode"](' + key.charCodeAt(0) + ')';
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
    var character = "", value, original;
    
    function replace(pattern, replacement){
      value = value.replace(
        new RegExp(pattern, "gi"), 
        replacement
      );
    }
    
    for (var i = MIN; i <= MAX; i++){
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
      
      try {
        eval(value);
      } catch (e) {
        throw "Can't convert " + character + "\n" + original + "\n" + value;
      }
      
      MAPPING[character] = value;
    }
  }

  function swap(input, recursive){
    
    if (input == "") { return ""; }
    
    var character = input[0], 
      length = 1, 
      replacement, 
      next,
      key;
    
    for (key in SIMPLE){
      if (input.indexOf(key) === 0){
        replacement = SIMPLE[key];
        length = key.length;
        if (input.length === length) {
          replacement += "+[]";
        }
      }
    }
    
    replacement = replacement || MAPPING[character];
    
    next = input.substr(length);
    input = input.substr(0, length);
    
    return (recursive ? "" : " + \n" ) + "/* " + input + " */ " + replacement + swap(next, false);
  }
    
  function encode(input){
    var output = swap(input, true),
      evaluated = eval(output);
    
    if (input == evaluated){
      console.log(output);
      console.log(input);
    } else {
      console.error("FAILED");
      console.log(input);
      console.log(evaluated);
    }
  }
  
  fillMissingDigits();
  fillMissingChars();
  replaceMap();
  
  
  
  var input = "true\"false\"InfinityundefinedNaNalert(1);";
  for (var i = MIN; i <= MAX; i++){
    input += String.fromCharCode(i);
  }
  encode(input);
  
  console.log("\nDONE")
  
})();