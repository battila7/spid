const { readFile } = require('fs');

const downson = require('downson');

const FEATURES_FILENAME = 'features.spid';
const UTF8_ENCODING = 'utf8';

function readFeaturesFile() {
    return new Promise((resolve, reject) => {
        readFile(FEATURES_FILENAME, { encoding: UTF8_ENCODING }, (err, data) => err ? reject(err) : resolve(data));
    });
}

function isContainerObject(obj) {
    return Object.keys(obj).every(k => obj[k] !== null && (typeof obj[k] == 'object'));
}

function isFeatureObject(obj) {
    if (Object.keys(obj).length > 1) {
        return false;
    }

    return obj.location && (typeof obj.location == 'string');
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
    return readFeaturesFile()
        .then(downson)
        .then(({ data, hasInterpretationErrors }) => {
            if (hasInterpretationErrors) {
                throw new Error('The features file cannot be interpreted correctly!');
            }

            return data;
        })
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
