const { readFile } = require('fs');

const downson = require('downson');

const FEATURES_FILENAME = 'features.spid';
const UTF8_ENCODING = 'utf8';

function readFeaturesFile() {
    return new Promise((resolve, reject) => {
        readFile(FEATURES_FILENAME, { encoding: UTF8_ENCODING }, (err, data) => err ? reject(err) : resolve(data));
    });
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
        });
}

module.exports = {
    readFeatures
};
