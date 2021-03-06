const path = require('path');

const { mkdir } = require('fs-extra');
const uuidv4 = require('uuid/v4');

const sysinfo = require('../sysinfo');

const { readFeatures } = require('../feature/read');
const { runFeature } = require('../feature/run');

function arrayStartsWith(prefix, arr) {
    if (prefix.length > arr.length) {
        return false;
    }

    return prefix.every((value, index) => value == arr[index]);
}

module.exports = {
    command: 'run [keys...]',
    desc: 'Run the specified benchmarks. If no keys are specified, then all benchmarks will be run.',
    builder(yargs) {
        return yargs
            .option('checkoutDirectory', {
                alias: 'c',
                type: 'string',
                default: path.join(process.cwd(), 'spid-checkout'),
                describe: 'The directory into which the code will be checked out.'
            })
            .options('resultDirectory', {
                alias: 'r',
                type: 'string',
                default: path.join(process.cwd(), 'spid-result'),
                describe: 'The directory into which the benchmark results will be saved.'
            });
    },
    handler(argv) {
        const selectedKeys = argv.keys || [];
        
        const featureDataPromise = readFeatures()
            .catch(err => {
                console.log('Could not read the list of available features:');
                console.log(err);

                process.exit(1);
            })
            .then(data => {
                return {
                    description: data.description,
                    features: data.features.filter(f => arrayStartsWith(selectedKeys, f.keys))
                };
            })
            .then(data => {
                if (data.features.length == 0) {
                    console.log('No matching benchmarks found!');
                    process.exit(1);
                }

                console.log('Selected features:\n');
                data.features
                    .map(f => f.keys.join(' ') + '\ttree-ish: ' + f.data.treeish)
                    .forEach(s => console.log('\t' + s));

                return data;
            })
            .then(data => {
                return mkdir(argv.resultDirectory).then(data, () => data);
            });

        const sysinfoPromise = sysinfo()
            .then(info => {
                console.log('Host has the following parameters:');
                console.log(JSON.stringify(info, null, 2));

                return info
            });

        Promise.all([featureDataPromise, sysinfoPromise])
            .then(([data, info]) => {
                const options = Object.assign({}, data.description, {
                    checkoutDirectory: argv.checkoutDirectory,
                    resultDirectory: argv.resultDirectory,
                    uuid: uuidv4(),
                    sysinfo: info
                });

                console.log('This run has the following id: ' + options.uuid + '\n');

                function reduceCallback(acc, curr) {
                    function runNext(prevResult) {
                        return runFeature(curr, options)
                            .then(currentResult => prevResult && currentResult);
                    };

                    return acc.then(runNext);
                }

                return data.features.reduce(reduceCallback, Promise.resolve(true));
            })
            .then(result => {
                if (!result) {
                    process.exit(1);
                }
            })
    }
};
