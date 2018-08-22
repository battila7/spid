const execa = require('execa');

module.exports = function clone(repository, directory) {
    return execa('git', ['clone', repository, directory], { stdio: 'inherit' });
};
