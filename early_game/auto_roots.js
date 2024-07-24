/** @param {NS} ns */
export async function main(ns) {
  const my_level = ns.getHackingLevel()
  const files = ["auto_roots.js", "calc_ram.js", "money_print.js", "kill_all.js"]
  let target = ns.args[0];
  let get_neighbors = ns.scan();
  get_neighbors = get_neighbors.slice(0, 7);
  for (let host of get_neighbors) {
    let required_ports = ns.getServerNumPortsRequired(host)
    let hacking_level = ns.getServerRequiredHackingLevel(host)
    nuke_hosts(ns, host, required_ports, hacking_level, my_level)
    copy_run_kill(ns, target, host, files)
    await ns.sleep(500);
  }
  await ns.sleep(500);
  ns.spawn("calc_ram.js", { threads: 1, spawnDelay: 10000 }, target);
}

/**@param {NS} ns Scripts needed to work
 * @param {String} target Arguement passed from cli to script
 * @param {String} host The current host being worked on
 * @param {String[]} files The files being copied over
 */
async function copy_run_kill(ns, target, host, files) {
  ns.scp(files, host, "home")
  let host_processes = ns.ps(host);
  if (host_processes.length == 0) {
    ns.exec("auto_roots.js", host, 1, target)
  } else {
    for (let process of host_processes) {
      var script_name = process.filename
      if (script_name != "auto_roots.js") {
        ns.kill(process.pid);
        ns.exec("auto_roots.js", host, 1, target)
      }
    }
  }
}



/** @param {NS} ns  Collection of all functions passed to script
 *  @param {String} host  the host that you are trying to hack
 *  @param {Number} required_ports  required ports that they need to be hacked
 *  @param {Number} hacking_level  the server's hack level
 *  @param {Number} my_level  your hack level
*/
async function nuke_hosts(ns, host, required_ports, hacking_level, my_level) {
  var hacking_progs = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject];
  for (var ports = 0; ports <= required_ports; ports++) {
    try {
      if (required_ports == 0) {
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
