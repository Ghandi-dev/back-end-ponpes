import cron from "node-cron";
import paymentService from "../service/payment.service";

// Jalan tiap tanggal 1 jam 00:01 pagi
cron.schedule("1 0 1 * *", async () => {
  try {
    console.log("⏰ Running cron job to generate new SPP bills...");
    // Call the function to create the SPP payment for the next month
    await paymentService.createSpp();
    console.log("✅ SPP bill generation completed successfully.");
  } catch (error) {
    console.error("❌ Error while generating SPP bill:", error);
  }
});
