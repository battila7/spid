const { readFeatures } = require('../feature/read');

module.exports = {
    command: 'list',
    desc: 'List available features.',
    handler() {
        readFeatures()
            .then(features => {
                console.log('Available features:\n');

                features
                    .map(f => f.keys.join(' ') + '\ttree-ish: ' + f.data.treeish)
                    .forEach(s => console.log('\t' + s));
            })
            .catch(err => {
                console.log('Could not read the list of available features:');
                console.log(err);
            });
    }
};
