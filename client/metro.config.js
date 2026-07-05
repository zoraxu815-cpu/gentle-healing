const { getDefaultConfig } = require('expo/metro-config');

// 兼容旧版 Node.js 的 polyfill
if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function() {
    return this.slice().reverse();
  };
}

const config = getDefaultConfig(__dirname);

module.exports = config;
