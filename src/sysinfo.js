const si = require('systeminformation');

const sysinfo = {};

const cpu = si.cpu()
    .then(function addCpu(cpu) {
        sysinfo.cpu = {
            manufacturer: cpu.manufacturer,
            brand: cpu.brand,
            speed: cpu.speed,
            cores: cpu.cores,
            family: cpu.family,
            model: cpu.model
        };
    });

const mem = si.mem()
    .then(function addMem(mem) {
        sysinfo.memory = {
            total: mem.total,
            free: mem.free
        };
    })
    .then(() => si.memLayout())
    .then(function addMemLayout(memLayout) {
        sysinfo.memory.layout = memLayout.map(mem => {
            return {
                size: mem.size,
                type: mem.type,
                clockSpeed: mem.clockSpeed
            };
        });
    });

const osInfo = si.osInfo()
    .then(function addOs(osInfo) {
        sysinfo.os = {
            platform: osInfo.platform,
            distro: osInfo.distro,
            release: osInfo.release,
            arch: osInfo.arch
        };
    });

module.exports = () => Promise.all([ cpu, mem, osInfo ]).then(() => sysinfo);
