/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("hack");
  ns.disableLog("grow");
  ns.disableLog("weaken");
  let svhostname = ns.args[0];
  let set_max_money = ns.args[1];
  let set_min_sec = ns.args[2];
  let normal_max_money = ns.formatNumber(set_max_money);
  while (true) {
    let currentSecurityLevel = ns.getServerSecurityLevel(svhostname);
    let currentMoneyAvailable = ns.getServerMoneyAvailable(svhostname);
    let normal_money_number = ns.formatNumber(currentMoneyAvailable);
    ns.clearLog();
    ns.print("Current Target: " + svhostname + "\nTarget Money: $" + normal_max_money + "\nCurrent Money: $" + normal_money_number +"\nCurrent Security: " + Math.floor(currentSecurityLevel) + 
    "\nTarget Security: " + set_min_sec);
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
  let tDate = Date.now() / 1000
  let tZone = 4
  let tMonth = Math.floor(tDate / 2629743 + 1) % 12;
  if (tMonth == 0){
    tMonth = 12
  }
  if (tMonth > 11 || tMonth < 3){
    tZone = tZone + 1
  }
  let tHackTime = tDate + ns.getHackTime(svhostname) / 1000;
  let tGrowTime = tDate + ns.getGrowTime(svhostname) / 1000;
  let tWeakTime = tDate + ns.getWeakenTime(svhostname) / 1000;
  let fHours = Math.floor(tDate / 3600 - tZone) % 24;
  let fMinutes = Math.floor(tDate / 60) % 60;
  let fSeconds = Math.floor(tDate) % 60;
  let sHours  = await add_padding(fHours)
  let sMinutes = await add_padding(fMinutes)
  let sSeconds = await add_padding(fSeconds)
  ns.printf("Started at %s:%s:%s", sHours,sMinutes,sSeconds);
  if (isDoing == 0){
    let fHHours = Math.floor(tHackTime / 3600 - tZone ) % 24;
    let fHMinutes = Math.floor(tHackTime/ 60) % 60;
    let fHSeconds = Math.floor(tHackTime) % 60;
    let sHHours = await add_padding(fHHours);
    let sHMinutes = await add_padding(fHMinutes);
    let sHSeconds = await add_padding(fHSeconds);
    ns.printf("Currently hacking, will complete at %s:%s:%s", sHHours, sHMinutes, sHSeconds);
  } else if (isDoing == 1){
    let fGHours = Math.floor(tGrowTime / 3600 - tZone) % 24;
    let fGMinutes = Math.floor(tGrowTime / 60) % 60;
    let fGSeconds = Math.floor(tGrowTime) % 60;
    let sGHours = await add_padding(fGHours);
    let sGMinutes = await add_padding(fGMinutes);
    let sGSeconds = await add_padding(fGSeconds);
    ns.printf("Currently growing, will complete at %s:%s:%s", sGHours, sGMinutes, sGSeconds);
  } else {
    let fWHours = Math.floor(tWeakTime / 3600 - tZone) % 24;
    let fWMinutes = Math.floor(tWeakTime / 60) % 60;
    let fWSeconds = Math.floor(tWeakTime) % 60;
    let sWHours = await add_padding(fWHours);
    let sWMinutes = await add_padding(fWMinutes);
    let sWSeconds = await add_padding(fWSeconds);
    ns.printf("Currently weakening, will complete at %s:%s:%s", sWHours, sWMinutes, sWSeconds);
  }
}


/** @param {number} time */
async function add_padding(time){
  let sTime = time.toString();
  if (sTime.length == 1){
    return sTime = "0" + time.toString();
  }
  return sTime;
}
