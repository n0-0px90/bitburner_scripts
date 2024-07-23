/** @param {NS} ns */
export async function main(ns) {
  let svhostname = ns.getHostname();
  let hosts = ns.scan();
  hosts = hosts.slice(0, 7);
  for (var host of hosts) {
    if(ns.isRunning("calc_ram.js", host) == false){
      ns.exec("calc_ram.js", host);  
    }
    await ns.sleep(2000);
  }
  let server_ram = Math.round(ns.getServerMaxRam(svhostname));
  let execthreads = await calc_ram(server_ram);
  await ns.sleep(3000);
  let set_max_money = ns.getServerMaxMoney(svhostname) * .75;
  let set_min_sec = ns.getServerMinSecurityLevel(svhostname) + 3;
  ns.spawn("money_print.js", {threads: execthreads, spawnDelay: 100}, svhostname, set_max_money, set_min_sec);
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

