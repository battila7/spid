const path = require('path');

const { mkdir } = require('fs-extra');

const clone = require('./steps/clone');
const cleanup = require('./steps/cleanup');
const checkout = require('./steps/checkout');

const { runFixture } = require('../fixture/run');

const { readFixtures } = require('../fixture/read');

function runFixtures({ description, fixtures }, feature, baseOptions) {
    const options = Object.assign({}, description, baseOptions);

    function reduceCallback(acc, curr) {
        return acc.then(() => runFixture(curr, feature, options));
    }

    return fixtures.reduce(reduceCallback, Promise.resolve());
}

function runFeature(feature, baseOptions) {
    console.log('\nBenchmarking feature: ' + feature.keys.join(' ') + '\n');

    const featureResultDirectory =  feature.keys.join('_') + '_' + options.uuid;

    const options = Object.assign({}, baseOptions, { resultDirectory: featureResultDirectory });

    const finallyFunc = () => cleanup(options.checkoutDirectory);

    return clone(options.remote, options.checkoutDirectory)
        .then(() => checkout(options.remote, feature.data.treeish, options.checkoutDirectory))
        .then(() => mkdir(path.join(options.resultDirectory, featureResultDirectory)))
        .then(() => readFixtures(path.resolve(options.checkoutDirectory, feature.data.fixturesFile)))
        .then(fixtures => runFixtures(fixtures, feature, options))
        .then(() => finallyFunc().then(true))
        .catch(err => {
            console.log('Error benchmarking feature: ' + feature.keys.join(' '));
            console.log(err);

            return finallyFunc().then(false)
        });
}

module.exports = {
    runFeature
};
