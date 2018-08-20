const { readDownson } = require('./downson');

const FEATURES_FILENAME = 'features.spid';

function isContainerObject(obj) {
    return Object.keys(obj).every(k => obj[k] !== null && (typeof obj[k] == 'object'));
}

function isFeatureObject(obj) {
    if (Object.keys(obj).length > 1) {
        return false;
    }

    return obj.treeish && (typeof obj.treeish == 'string');
}

function extractFeatures(obj) {
    function inner(obj, keys) {
        for (let key in obj) {
            if (isContainerObject(obj[key])) {
                return inner(obj[key], keys.concat([key]));
            } else if (isFeatureObject(obj[key])) {
                return result.push({
                    keys: keys.concat(key),
                    data: obj[key]
                });
            } else {
                throw new Error('Erroneous contents, the provided file is not a well-formed features file!');í
            }
        }
    }

    var result = [];

    inner(obj, []);

    return result;
}

function readFeatures() {
    return readDownson(FEATURES_FILENAME)
        .then(data => {
            if (!data.features) {
                throw new Error('The features file has no top-level features key!');
            }

            return data.features;
        })
        .then(extractFeatures)
}

module.exports = {
    readFeatures
};
