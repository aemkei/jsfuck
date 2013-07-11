var lib = require("./jsfuck.js");

if(process.argv.length !== 3) {
	console.error("Usage: node fuck.js <js file>");
	return;
}

var data = require("fs").readFileSync(process.argv[2], "utf8");
var output = lib.JSFuck.encode(data, false);
console.log(output);