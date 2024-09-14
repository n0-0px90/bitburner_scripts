/** @param {NS} ns*/
export async function main(ns) {
  ns.tail();
  ns.disableLog("sleep");
  while (true) { 
  let tDate = Date.now() / 1000; //<- Convert to seconds, ms makes everything harder
  let tHour = Math.floor(tDate / 3600 - 4) % 24;
  let tMinute = Math.floor(tDate / 60) % 60;
  let tSecond = Math.floor(tDate) % 60;
  ns.clearLog();
  ns.printf("Time is currently: %d:%d:%d", tHour, tMinute, tSecond);
  await ns.sleep(1000);
  }
}
