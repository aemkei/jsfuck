/*jshint -W061 */
'use strict';

var JSFuck = require('../jsfuck.js').JSFuck,
	test_encode = function (test, value) {
		var encoded = JSFuck.encode(value),
			unencoded = eval(encoded);

		test.strictEqual(value, unencoded, 'encoding "' + value + '" failed');
	};


var MIN = 32, MAX = 127;
var fs = require('fs');

exports['integration'] = {
	'test': function(test) {
		var file = fs.openSync('output.txt', 'w+'),
			simple = "`[]=+";

		simple += "j<>/\"\n";


		for (var i = MIN; i < MAX; i++) {
			var c = String.fromCharCode(i),
				encoded = JSFuck.encode(c);

			if (/^[\[\]\+\=]+$/.test(encoded)){
				simple += c;
			}

			fs.writeSync(file, '`' + c + '` ' + encoded.length + '\n');
		}

		fs.closeSync(file);

		function getProps(o){
			return Object.getOwnPropertyNames(o) || [];
		}

		function logValue(property, value) {

			if (typeof value === "undefined"){
				value = "undefined".red;
			}

			value = value + "";
			value = value.replace(/\s?\n\s?/g, "");

			var isSpecial = value.split("").find(function(char) {
				return !simple.includes(char);
			});

			if (isSpecial){
				value = value.magenta + isSpecial;
			} else {
				value = value.grey;
			}

			console.log("  ", property.green, ":", value);
		}

		var types = [simple, 12, [23], false, [].slice];

		types.forEach(function(instance){
			var constructor = instance.constructor,
				proto = Object.getPrototypeOf(instance),

				properties = []
					.concat(getProps(instance))
					.concat(getProps(proto))
					.filter(function(name) {
						return name.split('').every(function(char){
							return simple.includes(char);
						});
					});

			console.log("\n" + (constructor.name + "").yellow);

			properties.forEach(function(property) {
				var value = "XXX".red;
				value = instance[property];
				logValue(property, value);

				if (typeof instance[property] === "function"){
					try {
						value = instance[property]();
						logValue(property + "()", value);
					} catch(e) { }
				}


				try {
					value = proto[property];
					if (value){
						logValue(property + "*", value);
					}
				} catch(e) {}

				try {
					if (typeof proto[property] === "function"){
						value = instance[property]();
						if (value) {
							logValue(property + "*()", value);
						}
					}
				} catch(e) { }
			});
		});

		console.log("\nSIMPLE CHARS:" + simple);

		test.done();
	}
};

var test = function (c, test) {
	test_encode(test, c);
	test.done();
};

var createTest = function (input) {
	exports['encode_tests']['encode "'+input+'"'] = test.bind(undefined, input);
};

exports['encode_tests'] = {};

createTest('false');
createTest('falsefalsetrue');
createTest('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
createTest('abcdefghijklmnopqrstuvwxyz');

for(var i=MIN; i<MAX ;i++) {
	createTest(String.fromCharCode(i));
}
