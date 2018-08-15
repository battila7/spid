#!/usr/bin/env node
const path = require('path');

const CMD_DIRNAME = 'cmd';

require('yargs')
    .commandDir(path.resolve(__dirname, CMD_DIRNAME))
    .demandCommand()
    .help()
    .strict()
    .argv;
