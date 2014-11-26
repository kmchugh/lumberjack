'use strict';
require('conventional-changelog')({
	repository: 'https://github.com/kmchugh/lumberjack',
	version: 'v' + require('./package.json').version
}, function(err, log){
	var fs = require('fs');
	var file = './CHANGELOG.md';

	fs.writeFileSync(file, log);
	console.log(log);
});