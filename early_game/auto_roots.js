/** @param {NS} ns */
export async function main(ns) {
  const files = ["auto_roots.js", "calc_ram.js", "money_print.js"];
  let target = ns.args[0];
  let saStartNode = ['home'];
  let get_neighbors = await get_nodes(ns, saStartNode);
  for (let host of get_neighbors) {
    let required_ports = ns.getServerNumPortsRequired(host)
    nuke_hosts(ns, host, required_ports)
    copy_run_kill(ns, target, host, files)
    await ns.sleep(250);
  }
  await ns.sleep(1000);
  ns.spawn("calc_ram.js", { threads: 1, spawnDelay: 10000 }, target);
}

/** @param {NS} ns Scripts needed to work
 * @param {String[]} saStartNode The starting node to where you're at
 */
//saVisited is the start array, holds home.\
//home is scanned, array returned into saNode0
//returns first element of array to currentnode, checks to see if current node is in visited.
//if not in visited, push current node into visited, then were going to scan current node
//saFollowonNodes holds return for sCurrentNode scan.
//iterates through saFollowonNodes, if current node does not exist in saVisited, push to visited.
//Returns saVisisted
//NOTE this may jack something up later on
async function get_nodes(ns, saStartNode){
  let saVisited = saStartNode;
  let saNode0 = ns.scan('home');
  while (saNode0.length > 0){
    let sCurrentNode = saNode0.shift();
    if (saVisited.includes(sCurrentNode) == false){
      saVisited.push(sCurrentNode);
      let saFollowonNodes = ns.scan(sCurrentNode);
      for (let i = 0; i < saFollowonNodes.length; i++){
        if (saVisited.includes(saFollowonNodes[i]) == false){
          saNode0.push(saFollowonNodes[i]);
        }
      }
    }
  }
  return saVisited;
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
*/
async function nuke_hosts(ns, host, required_ports) {
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
