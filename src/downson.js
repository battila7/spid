const { readFile } = require('fs');

const downson = require('downson');

const UTF8_ENCODING = 'utf8';

function readUtf8File(filename) {
    return new Promise((resolve, reject) => {
        readFile(filename, { encoding: UTF8_ENCODING }, (err, data) => err ? reject(err) : resolve(data));
    });
}

function readDownson(filename, options) {
    return readUtf8File(filename)
        .then(data => downson(data, options))
        .then(function checkForInterpretationErrors({ data, failures, hasInterpretationErrors }) {
            if (hasInterpretationErrors) {
                const err = new Error(`The contents of "${filename}" cannot be interpreted correctly!`);

                err.failures = failures;

                throw err;
            }

            return data;
        });
}

module.exports = {
    readDownson
};
