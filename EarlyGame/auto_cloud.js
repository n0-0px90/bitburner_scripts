/** @param {NS} ns */
export async function main(ns) {
    let iaMaxRam = await calc_max_ram(ns);
    let nServerLimit = ns.getPurchasedServerLimit();
    let saCloudServers = ns.getPurchasedServers();
    let sCloudName = "cloud-server";
    while (true) {
      await ns.sleep(1000);
      let iCurrentMoney = ns.getServerMoneyAvailable('home');
      let iCloudServerCost = ns.getPurchasedServerCost(8);
      let strCloudName = sCloudName + "-" + saCloudServers.length;
      if (saCloudServers.length != nServerLimit) {
        if (iCurrentMoney >= iCloudServerCost) {
          let sPurchasedServer = ns.purchaseServer(strCloudName, 8);
          saCloudServers.push(sPurchasedServer);
        } else {
          continue;
        }
      } else {
        await upgrade_servers(ns, saCloudServers, iaMaxRam, iCurrentMoney)
      }
    }
  }
  
  async function upgrade_servers(ns, saCloudServers, iaMaxRam, iCurrentMoney) {
    for (let iRamIndex = 0; iRamIndex < iaMaxRam.length; iRamIndex++) {
      for (let iCloudIndex = 0; iCloudIndex < saCloudServers.length; iCloudIndex++) {
        let iUpgradeCost = ns.getPurchasedServerUpgradeCost(saCloudServers[iCloudIndex], iaMaxRam[iRamIndex]);
        if (iCurrentMoney >= iUpgradeCost) {
          try {
            ns.upgradePurchasedServer(saCloudServers[iCloudIndex], iaMaxRam[iRamIndex]);
          }
          catch { }
        } else {
          continue
        }
      }
    }
  }
  /** @param {NS} ns
   *  @return iaMaxRam  
   *  Quick maths
   */
  async function calc_max_ram(ns) {
    let iaMaxRam = [];
    for (let i = 4; i < 20; i++) {
      let nPower = Math.pow(2, i);
      iaMaxRam.push(nPower);
    }
    return iaMaxRam;
  }