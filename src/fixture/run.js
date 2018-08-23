const { getRunner } = require('../runner');

function runFixture(fixture, feature, options) {
    const runner = getRunner(options.runner);

    console.log('Running fixture: ' + fixture.key);

    if (!runner) {
        throw new Error('Runner "'  + name + '" not found!');
    }

    return runner(fixture, feature, options);
}

module.exports = {
    runFixture
};
