/*jshint -W061 */
'use strict';

var JSFuck = require('../jsfuck.js').JSFuck,
	test_encode = function (test, value) {
		var encoded = JSFuck.encode(value),
			unencoded = eval(encoded);

		test.strictEqual(value, unencoded, 'encoding "' + value + '" failed');
	};
var MIN = 32, MAX = 126;
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

exports['encode_tests'] = {
	'encode numbers': function(test) {
		for (var i=0; i<=10; i++) {
			test_encode(test, i+"");
		}
		test.done();
	},
	'encode "false"': function(test) {
		test_encode(test, 'false');
		test.done();
	},
	'encode "falsefalsetrue"': function(test) {
		test_encode(test, 'falsefalsetrue');
		test.done();
	},
	'encode "a"': function(test) {
		test_encode(test, 'a');
		test.done();
	},
	'encode "ABCDEFGHIJKLMNOPQRSTUVWXYZ"': function(test) {
		test_encode(test, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		test.done();
	},
	'encode "abcdefghijklmnopqrstuvwxyz"': function(test) {
		test_encode(test, 'abcdefghijklmnopqrstuvwxyz');
		test.done();
	}
};

exports['tests'] = {
	'encode 1': function(test) {
		var encoded = JSFuck.encode('1');
		test.equal(encoded, '[+!+[]]+[]');
		test.done();
	},
	'encode 2': function(test) {
		var encoded = JSFuck.encode('2');
		test.equal(encoded, '[!+[]+!+[]]+[]');
		test.done();
	},
	'encode 3': function(test) {
		var encoded = JSFuck.encode('3');
		test.equal(encoded, '[!+[]+!+[]+!+[]]+[]');
		test.done();
	}
};