const { readDownson } = require('../downson');

function extractFixtures(obj) {
    return Object.keys(obj)
        .reduce((acc, key) => acc.concat([ { key, data: obj[key] } ]), []);
}

function readFixtures(filename) {
    return readDownson(filename)
        .then(data => {
            if (!data.description) {
                throw new Error('The features file has no top-level description key!');
            }

            if (!data.fixtures) {
                throw new Error('The fixtures file has no top-level fixtures key!');
            }

            return data;
        })
        .then(data => {
            return {
                description: data.description,
                fixtures: extractFixtures(data.fixtures)
            };
        });
}

module.exports = {
    readFixtures
};
