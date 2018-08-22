const execa = require('execa');

module.exports = function clone(repository, treeish, cwd) {
    return execa('git', ['checkout', treeish], { stdio: 'inherit', cwd });
};
