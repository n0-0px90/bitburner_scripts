/** @param {NS} ns */
export async function main(ns) {
  let svhostname = ns.getHostname();
  let hosts = ns.scan();
  for (var host of hosts) {
    ns.exec("calc_ram.js", host);
    await ns.sleep(500);
  }
  let server_ram = Math.round(ns.getServerMaxRam(svhostname));
  let execthreads = await calc_ram(server_ram);
  await ns.sleep(1000);
  ns.spawn("money_print.js", {threads: execthreads, spawnDelay: 100}, svhostname);
}

/** Calculate how many threads you can use to run money_print.js 
 * @param {Number} max_ram The ram the server has
 * @returns The threads the server can use
 */
async function calc_ram(max_ram){
  let threads = Math.floor(max_ram / 3)
  if(threads <= 1){
    return threads=1;
  }
  return threads;
}

