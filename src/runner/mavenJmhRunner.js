const RUNNER_NAME = 'maven-jmh-runner';

function runner(fixture, feature, opts) {

}

module.exports = function setup(registerFunc) {
    registerFunc(NAME, runner);
};
