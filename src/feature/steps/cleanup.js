const { remove } = require('fs-extra');

module.exports = function cleanup(directory) {
    return remove(directory);
};
