/** @param {NS} ns */
export async function main(ns) {
  let target = ns.args[0];
  let svhostname = ns.getHostname();
  let server_ram = Math.floor(ns.getServerMaxRam(svhostname));
  let execthreads = await calc_ram(server_ram);
  let set_max_money = Math.ceil(ns.getServerMaxMoney(target) * .75);
  let set_min_sec = ns.getServerMinSecurityLevel(target) + 3;
  ns.exec("/scripts/share.js", svhostname)
  ns.spawn("/scripts/money_print.js", {threads: execthreads, spawnDelay: 100}, target, set_max_money, set_min_sec);
}

/** Calculate how many threads you can use to run money_print.js 
 * @param {Number} max_ram The ram the server has
 * @returns The threads the server can use  
 * Rudimentary math that gives an approximate thread return.  
 */
async function calc_ram(max_ram){
  let threads = Math.floor((max_ram / 2.35) - 2.4)
  if(threads <= 1){
    return threads=1;
  }
  return threads;
}
