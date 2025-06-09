import osUtils from 'os-utils';
const POLLING_INTERVAL = 500;

export function pollResources() {
   setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    console.log(cpuUsage);
    
   }, POLLING_INTERVAL);
}

function getCpuUsage() {
    return new Promise(resolve => {
        osUtils.cpuUsage(resolve);
    })
}