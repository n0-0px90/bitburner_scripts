/** @param {NS} ns */
export async function main(ns) {
  while (true) {
    await ns.sleep(30000)
    let node_price = ns.hacknet.getPurchaseNodeCost()
    let current_money = ns.getServerMoneyAvailable("home")
    if (current_money >= node_price) {
      let _ = ns.hacknet.purchaseNode();
    }
    let nodes_owned = ns.hacknet.numNodes()
    for (let node = 0; node < nodes_owned; node++) {
      let node_ram = ns.hacknet.getRamUpgradeCost(node)
      let node_core = ns.hacknet.getCoreUpgradeCost(node)
      let node_level = ns.hacknet.getLevelUpgradeCost(node)
      await purchase_upgrade_cost_core(ns, node_core, node, current_money)
      await purchase_upgrade_cost_ram(ns, node_ram, node, current_money)
      await purchase_upgrade_cost_level(ns, node_level, node, current_money)
    }
  }
}

/** @param {NS} ns
 *  @param {Number} node_ram
 *  @param {Number} node_index
 *  @param {Number} current_money
 *  @remarks Costs 0 RAM
*/
async function purchase_upgrade_cost_ram(ns, node_ram, node_index, current_money) {
  let ram_cost = node_ram
  let node = node_index
  if (current_money >= ram_cost) {
    ns.hacknet.upgradeRam(node)
  } else {
    return ns.print("Cant upgrade ram for hacknet-node-",node);
  }
}

/** @param {NS} ns
 *  @param {Number} node_core
 *  @param {Number} node_index
 *  @param {Number} current_money
 *  @remarks Costs 0 RAM
*/
async function purchase_upgrade_cost_core(ns, node_core, node_index, current_money) {
  let core_cost = node_core
  let node = node_index
  if (current_money >= core_cost) {
    ns.hacknet.upgradeCore(node)
  } else {
    return ns.print("Cant upgrade core for hacknet-node-",node);
  }
}

/** @param {NS} ns
 *  @param {Number} node_level
 *  @param {Number} node_index
 *  @param {Number} current_money
 *  @remarks Costs 0 RAM
*/
async function purchase_upgrade_cost_level(ns, node_level, node_index, current_money) {
  let level_cost = node_level
  let node = node_index
  if (current_money >= level_cost) {
    ns.hacknet.upgradeLevel(node)
  } else {
    return ns.print("Cant upgrade level for hacknet-node-",node);
  }
}
