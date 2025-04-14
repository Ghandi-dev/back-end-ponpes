// cron/init.ts
import { TYPE_PAYMENT } from "../models";
import paymentService from "../service/payment.service";

export async function runInitialSppCheck() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // Get the current month (1-12)
  const currentYear = today.getFullYear(); // Get the current year (2023, 2024, etc.)

  // Check if the SPP bill for the current month already exists
  const alreadyExists = await paymentService.checkIfSppExists({ month: currentMonth, year: currentYear, type: TYPE_PAYMENT.SPP });

  if (!alreadyExists) {
    console.log("🚀 Creating initial SPP bill as it doesn't exist...");
    await paymentService.createSpp();
  } else {
    console.log("✅ SPP bill for this month already exists.");
  }
}
