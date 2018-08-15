#!/usr/bin/env node
const CMD_DIRNAME = 'cmd';

require('yargs')
    .commandDir(CMD_DIRNAME)
    .demandCommand()
    .help()
    .strict()
    .argv;
