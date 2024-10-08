import "dotenv/config";
import { getCarsDetailWithRetry } from "./appleAuction.js";
import { sendMessage } from "./telegram.js";
import { CronJob } from "cron";

console.log("Start processing...");

if (process.env.RUN_ONCE === "true") {
  console.log("Running once");
  await run();
  console.log("Stopping process...");
} else {
  console.log(`Running with cron - ${process.env.CRON}`);
  runWithCron();
}

async function runWithCron() {
  try {
    const job = new CronJob(
      process.env.CRON,
      () => {
        run();
      },
      null,
      false,
      "Asia/Bangkok",
    );

    job.start();
    console.log(
      `Next 5 runs:\n${job
        .nextDates(5)
        .map((date) => date.toString())
        .join("\n")}`,
    );
    process.on("SIGINT", () => stopProcess(job));
    process.on("SIGTERM", () => stopProcess(job));
  } catch (error) {
    console.log("Cron pattern is invalid", error);
  }
}

function stopProcess(job) {
  console.log("Stopping process...");
  job.stop();
  process.exit();
}

async function run() {
  const data = await getCarsDetailWithRetry(
    "https://www.appleauction.co.th/goods/Search?&ProductCategoryCode=CR&BrandCode=20&ModelCode=20007&SubModelCode=&Year=&ColorCode=&GearCode=&CcId=&FuelType=&view=G&_=1723195316008",
  );
  const wantedCar = data.find((carData) => carData.find((d) => d === "46,902"));

  if (wantedCar === undefined) {
    console.log("No car found");
  } else {
    const carDetail = wantedCar.slice(1, wantedCar.length - 4).join(" ");
    const auctionDate = (wantedCar[wantedCar.length - 1] !== "รอประมูล" ? wantedCar[wantedCar.length - 2] : "รอประมูล").replace(" ", "");
    const auctionLocation = auctionDate !== "รอประมูล" ? wantedCar[wantedCar.length - 1] : "-";
    const msg = `รายละเอียด: ${carDetail}\nวันประมูล: ${auctionDate}\nสถานที่: ${auctionLocation}`;

    sendMessage(msg);
  }
}
