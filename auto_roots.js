/** @param {NS} ns */
export async function main(ns) {
  const my_level = ns.getHackingLevel()
  const files = ["auto_roots.js", "calc_ram.js", "money_print.js", "kill_all.js"]
  let get_neighbors = ns.scan();
  get_neighbors = get_neighbors.slice(0, 7);
  for (let host of get_neighbors) {
    let required_ports = ns.getServerNumPortsRequired(host)
    let hacking_level = ns.getServerRequiredHackingLevel(host)
    await nuke_hosts(ns, host, required_ports, hacking_level, my_level)
    ns.scp(files, host, "home")
    if(ns.isRunning("auto_roots.js", host) == false){
      ns.exec("auto_roots.js", host);
    }
    await ns.sleep(500);
  }
  await ns.sleep(10000);
  ns.scriptKill("auto_roots.js", ns.getHostname())
}
/** @param {NS} ns  Collection of all functions passed to script
 *  @param {String} host  the host that you are trying to hack
 *  @param {Number} required_ports  required ports that they need to be hacked
 *  @param {Number} hacking_level  the server's hack level
 *  @param {Number} my_level  your hack level
*/
export async function nuke_hosts(ns, host, required_ports, hacking_level, my_level) {
  var hacking_progs = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject];
  for(var ports=0; ports<=required_ports; ports++){
    try{
    if(required_ports == 0){
      ns.nuke(host);
    } else {
      var script = hacking_progs[ports];
      script(host);
      ns.nuke(host);
    }
    } catch (e) {
      ns.print(e);
    }    
  }
}
