const runnerMap = new Map();

const runnerFiles = [
    'mavenJmhRunner',
    'googleBenchmarkRunner'
];

function registerRunner(name, runner) {
    runnerMap.set(name, runner);
}

function getRunner(name) {
    return runnerMap.get(name);
}

module.exports = (function setup() {
    runnerFiles
        .map(f => './' + f)
        .map(require)
        .forEach(setup => setup(registerRunner));

    return {
        getRunner
    };
})();
