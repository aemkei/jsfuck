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
		var file = fs.openSync('output.txt', 'w+');

		for (var i = MIN; i < MAX; i++) {
			var c = String.fromCharCode(i),
				encoded = JSFuck.encode(c);
			fs.writeSync(file, '`' + c + '` ' + encoded.length + '\n');
		}

		fs.closeSync(file);
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
