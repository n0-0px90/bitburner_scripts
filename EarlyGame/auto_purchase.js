/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("hacknet.upgradeRam");
  ns.disableLog("hacknet.upgradeCore");
  ns.disableLog("hacknet.upgradeLevel");
  ns.disableLog("getServerMoneyAvailable");
  ns.disableLog("hacknet.getRamUpgradeCost");
  ns.disableLog("hacknet.getCoreUpgradeCost");
  ns.disableLog("hacknet.getLevelUpgradeCost");
  ns.disableLog("sleep");
  ns.tail();
  ns.clearLog();
  while (true) {
    await ns.sleep(1000)
    let node_price = ns.hacknet.getPurchaseNodeCost()
    let current_money = ns.getServerMoneyAvailable("home")
    let nodes_owned = ns.hacknet.numNodes()
    ns.printf("You own %d hacknet nodes.", nodes_owned);
    if (nodes_owned < 35) {
      if (current_money <= node_price) {
        ns.print("You're short on funds, waiting 30 seconds.");
        await ns.sleep(30000);
        ns.clearLog();
      } else {
        let node = ns.hacknet.purchaseNode();
        ns.printf("Purchased node: hacknet-node-%d", node);
        await ns.sleep(2500);
        ns.clearLog();
      }
    } else {
      for (let node = 0; node < nodes_owned; node++) {
        let node_ram = ns.hacknet.getRamUpgradeCost(node)
        let node_core = ns.hacknet.getCoreUpgradeCost(node)
        let node_level = ns.hacknet.getLevelUpgradeCost(node)
        purchase_upgrade_cost_core(ns, node_core, node, current_money)
        purchase_upgrade_cost_ram(ns, node_ram, node, current_money)
        purchase_upgrade_cost_level(ns, node_level, node, current_money)
        await ns.sleep(1000);
      }
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
    ns.printf("Cant upgrade ram for hacknet-node-%d", node);
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
    ns.printf("Cant upgrade core for hacknet-node-%d", node);
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
    ns.printf("Cant upgrade level for hacknet-node-%d", node);
  }
}
