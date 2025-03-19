// weekly-trade-stats.ts
import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

// Error handling wrapper for async functions
const handleError = (fn: Function) => {
    return async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error(`Error in cron job: ${error instanceof Error ? error.message : String(error)}`);
            // Log to monitoring service or send alert if needed
            // sendAlert(error);

            // Ensure Prisma connection is closed on error
            await prisma.$disconnect();
        }
    };
};


// Main cron job function
const updateDailyTradeStats = async () => {
    console.log(`[${new Date().toISOString()}] Starting weekly trade stats update...`);

    let tradeCount = await prisma.trade.count();
    let userCount = await prisma.user.count();
    const eventCount = await prisma.event.count();

    // Aggregate total trade amount for the past week
    const totalTradeAmount = await prisma.trade.aggregate({
        _sum: { amount: true },
        where: {
            createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Past 7 days
            }
        }
    });

    const resp = await fetch("https://blockstream.info/testnet/api/address/tb1pd0epx6sjty2xd2ukxmj5j59a3nykuggkkqqsm28x5uweev6s7peqr32gvq");
    const data = await resp.json()
    

    const statsId = await prisma.platformStats.findFirst();

    if (!statsId) {

        // Create empty record if doesnt exists
        await prisma.platformStats.create({
            data: {

            }
        })
    }
    
    await prisma.platformStats.updateMany({
        where: {
            id: statsId?.id
        },
        data: {
            tradeCount,
            userCount,
            eventCount,
            totalAmountTraded: parseInt((totalTradeAmount._sum.amount || 0).toString()),
            totalValueLocked: data.chain_stats.funded_txo_sum
        },
    });


};

// Schedule the cron job to run every Sunday at midnight
cron.schedule("0 0 * * *", handleError(updateDailyTradeStats), {
    timezone: "UTC" // Specify timezone if needed
});

// Also expose a function to run the job manually if needed
export const runManualUpdate = handleError(updateDailyTradeStats);

console.log("Weekly trade stats cron job scheduled to run every Sunday at midnight (UTC).");

// Handle termination signals for clean shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});