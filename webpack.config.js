const path = require('path');

module.exports = [
  {
    entry: ['./src/music.js'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'music-bundle.js',
    },
  }
];