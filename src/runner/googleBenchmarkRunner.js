const path = require('path');

const execa = require('execa');

const RUNNER_NAME = 'google-benchmark-runner';

function createGbArgs(runnerSettings) {
    runnerSettings['benchmark_format'] = 'json';

    if (runnerSettings['benchmark_out']) {
        delete runnerSettings['benchmark_out']
    }

    return Object.keys(runnerSettings)
        .map(key => ['--' + key + '=' + runnerSettings[key]])
        .reduce((acc, curr) => acc.concat(curr), []);
}

function createParameters(additionalSettings) {
    return Object.keys(additionalSettings)
        .map(key => ['-p', key + '=' + additionalSettings[key]])
        .reduce((acc, curr) => acc.concat(curr), []);
}

function runner(fixture, feature, options) {
    const baseDirectory = path.resolve(options.checkoutDirectory, options.baseDirectory || '');

    const setupScript = path.resolve(baseDirectory, options.setupScript);
    const cleanupScript = path.resolve(baseDirectory, options.cleanupScript);
    const executable = path.resolve(baseDirectory, options.executable);

    const exec = options.runWith || executable;

    let args = [];

    if (options.runWith) {
        args.push(options.executable);
    }

    args = args.concat(createGbArgs(fixture.data.runnerSettings), createParameters(fixture.data.parameters));

    let opts = {
        stdio: [ 'inherit', 'pipe', 'inherit' ]
    };

    if (options.runWith) {
        opts.cwd = baseDirectory;
    };

    return execa(options.shell, [ setupScript ], { cwd: baseDirectory, stdio: 'inherit' })
        .then(() => {
            return execa(exec, args, opts);
        })
        .then(resultObj => {
            return execa(options.shell, [ cleanupScript], { cwd: baseDirectory, stdio: 'inherit' }).then(() => resultObj.stdout);
        })
        .then(jsonString => JSON.parse(jsonString));
}

module.exports = function setup(registerFunc) {
    registerFunc(RUNNER_NAME, runner);
};
