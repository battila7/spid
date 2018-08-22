const clone = require('./steps/clone');
const cleanup = require('./steps/cleanup');
const checkout = require('./steps/checkout');

const { runFixture } = require('../fixture/run');

function runFeature(feature, options) {
    console.log('\Benchmarking feature: ' + feature.keys.join(' ') + '\n');

    const finallyFunc = () => cleanup(options.checkoutDirectory);

    return clone(options.remote, options.checkoutDirectory)
        .then(() => checkout(options.remote, feature.data.treeish, options.checkoutDirectory))
        .then(() => runFixture())
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
