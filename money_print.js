/** @param {NS} ns */
export async function main(ns) {
  var svhostname = ns.getHostname()
  var set_max_money = ns.getServerMaxMoney(svhostname) * .75
  var set_min_sec = ns.getServerMinSecurityLevel(svhostname) + 3
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
