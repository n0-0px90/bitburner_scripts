/** @param {NS} ns */
export async function main(ns) {
  let saStartNode = ['home'];
  const get_neighbors = await get_nodes(ns, saStartNode);
  const files = ["calc_ram.js", "money_print.js", "calc_share.js", "share.js"];
  let target = ns.args[0];
  if(target == null){
    let objServers = get_neighbors.map(ns.getServer);
    objServers.sort((a, b) => a.moneyMax - b.moneyMax);
    ns.clearLog();
    for(let host of objServers){
      let hMaxMoney = ns.formatNumber(host.moneyMax);
      ns.print("=============\n" +host.hostname + "\nSkill Required: " + host.requiredHackingSkill + "\nSecurity: " + host.minDifficulty + "\nMax Money:" + hMaxMoney);
    }
    ns.print("syntax: auto_roots.js <target>");
    ns.print("This is a simple file that scans and attacks for you.");
    return;
  }
  let _ = get_neighbors.shift(); //Gets rid of home, this is where you start and where the script will be located anyway.
  for (let host of get_neighbors) {
    let required_ports = ns.getServerNumPortsRequired(host)
    if (!ns.hasRootAccess(host)) {
      await nuke_hosts(ns, host, required_ports)
    }
    await copy_run_kill(ns, target, host, files)
  }
}

/**@param {NS} ns Scripts needed to work
 * @param {String[]} saStartNode The starting node you're at  
//saVisited is the start array, holds home.\
//home is scanned, array returned into saNode0  
//returns first element of array to currentnode, checks to see if current node is in visited.  
//if not in visited, push current node into visited, then were going to scan current node  
//saFollowonNodes holds return for sCurrentNode scan.  
//iterates through saFollowonNodes, if current node does not exist in saVisited, push to visited.  
//Returns saVisisted  
//NOTE this may jack something up later on  
*/
async function get_nodes(ns, saStartNode) {
  let saVisited = saStartNode;
  let saNode0 = ns.scan('home');
  while (saNode0.length > 0) {
    let sCurrentNode = saNode0.shift();
    if (saVisited.includes(sCurrentNode) == false) {
      saVisited.push(sCurrentNode);
      let saFollowonNodes = ns.scan(sCurrentNode);
      for (let i = 0; i < saFollowonNodes.length; i++) {
        if (saVisited.includes(saFollowonNodes[i]) == false) {
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
 * Copies files, runs auto_roots.js, else kills all other scripts running and then runs auto_roots.js
 */
async function copy_run_kill(ns, target, host, files) {
  ns.scp(files, host, "home")
  let host_processes = ns.ps(host);
  if (host_processes.length == 0) {
    ns.exec("calc_ram.js", host, 1, target)
  } else {
    for (let process of host_processes) {
      var script_name = process.filename
      if (script_name != "calc_ram.js") {
        ns.kill(process.pid);
        ns.exec("calc_ram.js", host, 1, target)
      }
    }
  }
}



/** @param {NS} ns  Collection of all functions passed to script
 *  @param {String} host  the host that you are trying to hack
 *  @param {Number} required_ports  required ports that they need to be hacked  
 * Checks to see how many ports are required to hack, if its too many, its still gonna try.  
 * Thank God for error handling.  
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

