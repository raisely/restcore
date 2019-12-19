// detect environmental settings
const avoidBabel = process.env.NO_BABEL === 'true';
const avoidMinify = process.env.NO_MINIFY === 'true';

function determineDestFileFromEnv() {
	// output filename that's joined by dot-names
	const fileParts = ['dist/restcore'];

	if (!avoidBabel) {
		fileParts.push('dist');
	}

	if (!avoidMinify) {
		fileParts.push('min');
	}

	// add extension
	fileParts.push('js');

	return fileParts.join('.');
}

function determinePluginsFromEnv() {
	// define plugins dynamically
	const plugins = [];

	if (!avoidBabel) {
		const babel = require('rollup-plugin-babel');

		plugins.push(
			babel({
				exclude: 'node_modules/**',
				babelrc: false,
				presets: [
					['@babel/env', {
						targets: {
							browsers: ['>0.25%', 'not ie 10', 'not op_mini all'],
						},
						modules: false
					}]
				],
				plugins: [
					'babel-plugin-transform-async-to-promises'
				],
			})
		);
	}

	if (!avoidMinify) {
		const { terser } = require('rollup-plugin-terser');

		plugins.push(
			terser({
				sourcemap: true,
				mangle: true,
			})
		);
	}

	return plugins;
}

// configuration file
module.exports = {
	input: 'src/restcore.js',
	output: {
		file: determineDestFileFromEnv(),
		format: 'cjs',
	},
	plugins: determinePluginsFromEnv(),
}
