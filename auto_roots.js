/** @param {NS} ns */
export async function main(ns) {
  const my_level = ns.getHackingLevel()
  const files = ["auto_roots.js", "calc_ram.js", "money_print.js"]
  var get_neighbors = ns.scan()
  for (var host of get_neighbors) {
    var required_ports = ns.getServerNumPortsRequired(host)
    var hacking_level = ns.getServerRequiredHackingLevel(host)
    nuke_hosts(ns, host, required_ports, hacking_level, my_level)
    ns.scp(files, host, "home")
    ns.exec("auto_roots.js", host)
    await ns.sleep(500)
  }
  await ns.sleep(10000)
  for (let host of get_neighbors){
    if (ns.isRunning("auto_roots.js", host)) {
      await ns.sleep(500)
      ns.scriptKill("auto_roots.js", host)
    }
  }
  ns.scriptKill("auto_roots.js", ns.getHostname())
}
/** @param {NS} ns  Collection of all functions passed to script
 *  @param {String} host  the host that you are trying to hack
 *  @param {Number} required_ports  required ports that they need to be hacked
 *  @param {Number} hacking_level  the server's hack level
 *  @param {Number} my_level  your hack level
*/
export async function nuke_hosts(ns, host, required_ports, hacking_level, my_level) {
  if (my_level < hacking_level) {
    ns.tprint("Failed to hack ", host, " level not high enough.")
  } else {
    if (required_ports <= 2) {
      ns.brutessh(host)
      ns.ftpcrack(host)
      ns.nuke(host)
    } else {
      ns.tprint("Failed to hack ", host, ", missing required programs to open ports.")
    }
  }
}
