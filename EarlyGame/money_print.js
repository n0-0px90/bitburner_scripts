/** @param {NS} ns */
export async function main(ns) {
  let svhostname = ns.args[0];
  let set_max_money = ns.args[1];
  let set_min_sec = ns.args[2];
  let normal_max_money = ns.formatNumber(set_max_money);
  while (true) {
    let currentSecurityLevel = ns.getServerSecurityLevel(svhostname);
    let currentMoneyAvailable = ns.getServerMoneyAvailable(svhostname);
    let normal_money_number = ns.formatNumber(currentMoneyAvailable);
    ns.clearLog();
    ns.print("Maximum Money: $" + normal_max_money + "\nCurrent Money: $" + normal_money_number +"\nCurrent Security: " + currentSecurityLevel);
    if (currentSecurityLevel > set_min_sec) {
      await time(ns, svhostname, 2)
      await ns.weaken(svhostname)
      ns.clearLog();
    } else if (currentMoneyAvailable < set_max_money) {
      await time(ns, svhostname, 1);
      await ns.grow(svhostname)
      ns.clearLog();
    } else {
      await time(ns, svhostname, 0);
      await ns.hack(svhostname)
      ns.clearLog();
    }
  }
}

/** @param {NS} ns */
async function time(ns, svhostname, isDoing) {
  let tDate = Date.now() / 1000;
  let tHackTime = tDate + ns.getHackTime(svhostname) / 1000;
  let tGrowTime = tDate + ns.getGrowTime(svhostname) / 1000;
  let tWeakTime = tDate + ns.getWeakenTime(svhostname) / 1000;
  let fHours = Math.floor(tDate / 3600 - 4) % 24;
  let fMinutes = Math.floor(tDate / 60) % 60;
  ns.printf("Started hack at %d:%d", fHours,fMinutes)
  if (isDoing == 0){
    let fHHours = Math.floor(tHackTime / 3600 - 4 ) % 24;
    let fHMinutes = Math.floor(fMinutes / 60) % 60;
    ns.printf("Currently hacking, will complete at %d:%d", fHHours, fHMinutes);
  } else if (isDoing == 1){
    let fGHours = Math.floor(tGrowTime / 3600 - 4) % 24;
    let fGMinutes = Math.floor(tGrowTime / 60) % 60;
    ns.printf("Currently growing, will complete at %d:%d", fGHours, fGMinutes);
  } else {
    let fWHours = Math.floor(tWeakTime / 3600 - 4) % 24;
    let fWMinutes = Math.floor(tWeakTime / 60) % 60;
    ns.printf("Currently weakening, will complete at %d:%d", fWHours, fWMinutes);
  }
}

