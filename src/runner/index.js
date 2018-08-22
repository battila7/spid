const runnerMap = new Map();

function registerRunner(name, runner) {
    runnerMap.set(name, runner);
}

function getRunner(name) {
    return runnerMap.get(name);
}

module.exports = {
    registerRunner,
    getRunner
};
