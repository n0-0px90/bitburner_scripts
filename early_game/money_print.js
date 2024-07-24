/** @param {NS} ns */
export async function main(ns) {
  let svhostname = ns.args[0];
  let set_max_money = ns.args[1];
  let set_min_sec = ns.args[2];
  while (true) {
    if (ns.getServerSecurityLevel(svhostname) > set_min_sec) {
      await ns.weaken(svhostname)
    } else if (ns.getServerMoneyAvailable(svhostname) < set_max_money) {
      await ns.grow(svhostname)
    } else {
      await ns.hack(svhostname)
    }
  }
}
