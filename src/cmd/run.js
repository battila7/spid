const { readFeatures } = require('../feature/read');

function arrayStartsWith(prefix, arr) {
    if (prefix.length > arr.length) {
        return false;
    }

    return prefix.every((value, index) => value == arr[index]);
}

module.exports = {
    command: 'run [keys...]',
    desc: 'Run the specified benchmarks. If no keys are specified, then all benchmarks will be run.',
    handler(argv) {
        const selectedKeys = argv.keys || [];
        
        readFeatures()
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
            });
    }
};
