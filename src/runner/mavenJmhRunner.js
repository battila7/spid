const path = require('path');
const { readJson, remove } = require('fs-extra');

const execa = require('execa');

const RUNNER_NAME = 'maven-jmh-runner';

function createJmhArgs(runnerSettings) {
    runnerSettings.rf = 'json';

    if (runnerSettings.rff) {
        delete runnerSettings.rff;
    }

    return Object.keys(runnerSettings)
        .map(key => ['-' + key, runnerSettings[key]])
        .reduce((acc, curr) => acc.concat(curr), []);
}

function createParameters(additionalSettings) {
    return Object.keys(additionalSettings)
        .map(key => ['-p', key + '=' + additionalSettings[key]])
        .reduce((acc, curr) => acc.concat(curr), []);
}

function runner(fixture, feature, options) {
    const baseDirectory = path.resolve(options.checkoutDirectory, options.baseDirectory || '');
    const jar = path.resolve(options.checkoutDirectory, fixture.data.runnerSettings.jarFile || options.jarFile);
    const benchmark = fixture.data.runnerSettings.benchmark || options.benchmark;

    const resultFile = path.join(options.resultDirectory, fixture.key + '.temp.json');

    return execa('mvn', ['clean', 'install', '-Dmaven.test.skip=true'], { cwd: baseDirectory, stdio: 'inherit' })
        .then(() => {
            return execa('java', [
                '-jar', jar,
                benchmark,
                ...createJmhArgs(fixture.data.runnerSettings),
                ...createParameters(fixture.data.parameters),
                '-rff', resultFile
            ], { stdio: 'inherit' });
        })
        .then(() => readJson(resultFile))
        .then(resultObj => {
            return remove(resultFile).then(() => resultObj);
        });
}

module.exports = function setup(registerFunc) {
    registerFunc(RUNNER_NAME, runner);
};
