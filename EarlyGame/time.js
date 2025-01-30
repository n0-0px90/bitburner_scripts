/** @param {NS} ns*/
export async function main(ns) {
  ns.tail();
  ns.disableLog("sleep");
  let tZone = 4
  while (true) { 
  let tDate = Date.now() / 1000; //<- Convert to seconds, ms makes everything harder
  let tYear = Math.floor(tDate / 31556926 ) + 1970;
  let tMonth = Math.floor(tDate / 2629743 + 1) % 12;
  let tDay = Math.floor(tDate / 86400 + 3) % 30.44;
  
  if (tMonth == 0){
    tMonth = 12
  }

  if ((tMonth > 11) || (tMonth < 3)){
    tZone = tZone - 1
  }


  let tHour = Math.floor(tDate / 3600 - tZone) % 24;
  let tMinute = Math.floor(tDate / 60) % 60;
  let tSecond = Math.floor(tDate) % 60;



  let sHour = await add_padding(tHour);
  let sMinute = await add_padding(tMinute);
  let sSecond = await add_padding(tSecond);
  ns.clearLog();
  ns.printf("Time is currently: %s:%s:%s %d-%d-%d", sHour, sMinute, sSecond, tYear, tMonth, tDay);
  await ns.sleep(1000);
  }
}

/** @param {number} time */
async function add_padding(time){
  let sTime = time.toString();
  if (sTime.length == 1){
    sTime = "0" + time.toString();
    return sTime;
  }
  return time.toString();
}
