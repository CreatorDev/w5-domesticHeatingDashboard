var path = require('path');


module.exports = {
	entry: {
		app: ['./app/main.js']
	},
	output: {
		path: __dirname + '/app',
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loaders: ["babel-loader"]
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader?modules',
				include: /flexboxgrid/,
            },
            { test: /\.json$/, loader: 'json-loader' }
		]
    }
};
