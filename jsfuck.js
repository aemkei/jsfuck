(function(){
  
  var USE_CHAR_CODE = "USE_CHAR_CODE";
  
  var MIN = 32, MAX = 126;
  
  var MAPPING = {
    "a":   '("false")[1]',
    "b":   '(window+[])[2]',
    "c":   '([]["filter"]+[])[3]',
    "d":   '("undefined")[2]',
    "e":   '("true")[3]',
    "f":   '("false")[0]', 
    "g":   '([]+("")["constructor"])[14]',
    "h":   '(+(17))["toString"](18)',
    "i":   '([false]+undefined)[10]',
    "j":   '(window+"")[3]',
    "k":   '(+(20))["toString"](21)',
    "l":   '("false")[2]',
    "m":   '(Number+"")[11]',
    "n":   '("undefined")[1]',
    "o":   '(true+[]["filter"])[10]',
    "p":   '(+(25))["toString"](30)',
    "q":   '(+(26))["toString"](30)',
    "r":   '("true")[1]',
    "s":   '("false")[3]',
    "t":   '("true")[0]',
    "u":   '("undefined")[0]',
    "v":   '(+(31))["toString"](32)',
    "w":   '(+(32))["toString"](33)',
    "x":   '(+(33))["toString"](34)',
    "y":   '(NaN+[Infinity])[10]',  // TODO: Shorten  
    "z":   '(+(35))["toString"](36)',

    "A":   '("function Array")[9]',
    "B":   '("function Boolean")[9]',
    "C":   'Function("return \'\\\\"+(103)+"\'")()',
    "D":   USE_CHAR_CODE,
    "E":   USE_CHAR_CODE,
    "F":   '("function Function")[9]',
    "G":   USE_CHAR_CODE,
    "H":   USE_CHAR_CODE,
    "I":   '("Infinity")[0]',
    "J":   USE_CHAR_CODE,
    "K":   USE_CHAR_CODE,
    "L":   USE_CHAR_CODE,
    "M":   USE_CHAR_CODE,
    "N":   '("NaN")[0]',
    "O":   USE_CHAR_CODE,
    "P":   USE_CHAR_CODE,
    "Q":   USE_CHAR_CODE,
    "R":   USE_CHAR_CODE,
    "S":   '("function String")[9]',
    "T":   USE_CHAR_CODE,
    "U":   USE_CHAR_CODE,
    "V":   USE_CHAR_CODE,
    "W":   USE_CHAR_CODE,
    "X":   USE_CHAR_CODE,
    "Y":   USE_CHAR_CODE,
    "Z":   USE_CHAR_CODE,

    " ":   '([]["filter"]+[])[8]',
    "!":   USE_CHAR_CODE,
    "\"":  '("")["link"]()[8]',
    "#":   USE_CHAR_CODE,
    "$":   USE_CHAR_CODE,
    "%":   'window["escape"]("<")[0]',
    "&":   USE_CHAR_CODE,
    "'":   USE_CHAR_CODE,
    "(":   '([]["filter"]+"")[15]',
    ")":   '([]["filter"]+"")[16]',
    "*":   USE_CHAR_CODE,
    "+":   USE_CHAR_CODE,
    ",":   USE_CHAR_CODE,
    "-":   USE_CHAR_CODE,
    ".":   USE_CHAR_CODE,
    "/":   '("")["sub"]()[6]',
    ":":   'window["Date"]()[21]',
    ";":   USE_CHAR_CODE,
    "<":   '("")["sub"]()[0]',
    "=":   '("")["fontcolor"]()[11]',
    ">":   '("")["sub"]()[10]',
    "?":   USE_CHAR_CODE,
    "@":   USE_CHAR_CODE,
    "[":   USE_CHAR_CODE,
    "\\":  'window["unescape"]("%"+(5)+"c")[0]',
    "]":   USE_CHAR_CODE,
    "^":   USE_CHAR_CODE,
    "_":   USE_CHAR_CODE,
    "`":   USE_CHAR_CODE,
    "{":   '([]["filter"]+"")[18]',
    "|":   USE_CHAR_CODE,
    "}":   USE_CHAR_CODE,
    "~":   USE_CHAR_CODE
  };
  
  var CONST = {
    'false':      '![]',
    'true':       '!![]',
    'undefined':  '[][[]]',
    'NaN':        '+[![]]',
    'Infinity':   '+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]]+[+[]])'
  };
  
  
  function fillMissingChars(){
    for (var key in MAPPING){
      if (MAPPING[key] === USE_CHAR_CODE){
        MAPPING[key] = 'window["String"]["fromCharCode"](' + key.charCodeAt(0) + ')';
      }
    }
  }
  
  function fillMissingDigits(){
    var output, number, i;
    
    for (number=0; number<10; number++){
      
      output = "+[]";
      
      if (number > 0){ output = "+!" + output; }
      for (i=1; i < number; i++){ output = "+!+[]" + output; }
      if (number > 1){ output = output.substr(1); }
      
      MAPPING[number] = "[" + output + "]";
    }
  }
  
  function replaceMap(){
    var character = "", value, original, regEx, replacement;
    
    for (var i = MIN; i <= MAX; i++){
      character = String.fromCharCode(i);
      value = MAPPING[character];
      original = value;
      
      for (key in CONST){
        replacement = CONST[key];
        
        // replace quotes symbols
        regEx = new RegExp('"' + key + '"', "gi");
        value = value.replace(regEx, replacement + "+[]");

        // replace left symbols
        regEx = new RegExp(key, "gi");        
        value = value.replace(regEx, "(" + replacement + ")");
      }
      
      for (key = 0; key < 10; key++){
        regEx = new RegExp(key, "gi");        
        value = value.replace(regEx, "+[" + MAPPING[key] + "]");
      }
      
      value = value.replace(/""/gi, "[]+[]");
      
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
      key;
    
    for (key in CONST){
      if (input.indexOf(key) === 0){
        replacement = CONST[key];
        length = key.length;
        if (recursive && input.length === length) {
          replacement += "+[]";
        }
      }
    }
    
    replacement = replacement || MAPPING[character];
    
    input = input.substr(length);
    
    return (recursive ? "" : " + \n" ) + replacement + swap(input, false);
  }
  
  window = this;
  
  function encode(input){
    var output = swap(input, true);
    var evaluated = eval(output);
    
    
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
  //encode("f")
  
  console.log("\nDONE")
  
})();