const path = require('path');

const { writeJson } = require('fs-extra');

const { getRunner } = require('../runner');

function runFixture(fixture, feature, options) {
    const runner = getRunner(options.runner);

    console.log('Running fixture: ' + fixture.key);

    if (!runner) {
        throw new Error('Runner "'  + name + '" not found!');
    }

    const resultFile = path.join(options.resultDirectory, fixture.key + '.json');

    return runner(fixture, feature, options)
        .then(result => {
            return {
                feature,
                fixture,
                uuid: options.uuid,
                sysinfo: options.sysinfo,
                result
            };
        })
        .then(obj => writeJson(resultFile, obj));
}

module.exports = {
    runFixture
};
