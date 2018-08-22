const clone = require('./steps/clone');
const cleanup = require('./steps/cleanup');
const checkout = require('./steps/checkout');

const { runFixture } = require('../fixture/run');

const { readFixtures } = require('../fixture/read');

function runFixtures({ description, fixtures }, feature, baseOptions) {
    const runOpts = Object.assign({}, baseOptions, description);

    function reduceCallback(acc, curr) {
        return acc.then(() => runFixture(curr, feature, runOpts));
    }

    return fixtures.reduce(reduceCallback, Promise.resolve());
}

function runFeature(feature, options) {
    console.log('\nBenchmarking feature: ' + feature.keys.join(' ') + '\n');

    const finallyFunc = () => cleanup(options.checkoutDirectory);

    return clone(options.remote, options.checkoutDirectory)
        .then(() => checkout(options.remote, feature.data.treeish, options.checkoutDirectory))
        .then(() => readFixtures(path.resolve(options.checkoutDirectory, feature.fixturesFile)))
        .then(data => runFixtures(data, options))
        .then(() => finallyFunc().then(true))
        .catch(err => {
            console.log('Error benchmarking feature');
            console.log(err);

            return finallyFunc().then(false)
        });
}

module.exports = {
    runFeature
};
