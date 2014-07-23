'use strict';
require('conventional-changelog')({
	repository: 'https://github.com/kmchugh/lumberjack',
	version: require('./package.json').version
}, function(err, log){
	var path = require('path'),
		fs = require('fs');
	var file = './CHANGELOG.md';

	fs.writeFileSync(file, log);
});