var shell = require('shelljs');

shell.cp('-R', 'src/public/js/lib', 'dist/public/js/');
shell.cp('-R', 'src/public/fonts', 'dist/public/');
shell.cp('-R', 'src/public/images', 'dist/public/');
shell.cp('-R', 'src/public/favicon.ico', 'dist/public/');
shell.cp('-R', 'src/public/*.html', 'dist/public/');
