-- AlterTable
ALTER TABLE "Trade" ALTER COLUMN "order_size" SET DEFAULT 0,
ALTER COLUMN "order_size" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "afterPrice" SET DEFAULT 0,
ALTER COLUMN "afterPrice" SET DATA TYPE DECIMAL(65,30);
