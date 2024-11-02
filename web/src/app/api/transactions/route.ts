// app/api/transactions/route.ts

import { type NextRequest, NextResponse } from "next/server"; // Next.js API types
import { PrismaClient } from "@prisma/client"; // Prisma Client for MongoDB
import { env } from "~/env"; // Import environment variables

const prisma = new PrismaClient();

// Define the shape of a transaction returned by Etherscan API
type Transaction = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId?: string;
  functionName?: string;
};

// POST handler to retrieve and store transactions
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = (await req.json()) as { address: string };
    const { address }: { address: string } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Missing address parameter" },
        { status: 400 },
      );
    }

    // Get the Etherscan API key from environment variables
    const apiKey = env.ETHERSCAN_API_KEY;

    if (!apiKey) {
      throw new Error("Etherscan API key is not configured");
    }

    // Fetch the last 5 transactions from Etherscan API
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&page=1&offset=5&sort=desc&apikey=${apiKey}`;

    // Use fetch instead of axios
    const response = await fetch(url);

    // Check if the HTTP response status is OK (200-299)
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.statusText}`);
    }

    // Parse the JSON data from the response
    const data = (await response.json()) as {
      status: string;
      message: string;
      result: Transaction[];
    };

    // Check for errors in the Etherscan API response
    if (data.status !== "1") {
      throw new Error(`Etherscan API error: ${data.message}`);
    }

    const transactions: Transaction[] = data.result;

    // Store transactions in MongoDB using Prisma
    for (const tx of transactions) {
      await prisma.transaction.upsert({
        where: { hash: tx.hash },
        update: {}, // No update if transaction exists
        create: {
          address: address.toLowerCase(),
          blockNumber: parseInt(tx.blockNumber),
          timeStamp: new Date(parseInt(tx.timeStamp) * 1000),
          hash: tx.hash,
          nonce: parseInt(tx.nonce),
          blockHash: tx.blockHash,
          transactionIndex: parseInt(tx.transactionIndex),
          from: tx.from,
          to: tx.to,
          value: tx.value,
          gas: tx.gas,
          gasPrice: tx.gasPrice,
          isError: tx.isError,
          txreceipt_status: tx.txreceipt_status,
          input: tx.input,
          contractAddress: tx.contractAddress,
          cumulativeGasUsed: tx.cumulativeGasUsed,
          gasUsed: tx.gasUsed,
          confirmations: parseInt(tx.confirmations),
          methodId: tx.methodId,
          functionName: tx.functionName,
        },
      });
    }

    return NextResponse.json({ message: "Transactions stored successfully" });
  } catch (error) {
    console.error("Error retrieving or storing transactions:", error);
    return NextResponse.json(
      { error: "Failed to retrieve or store transactions" },
      { status: 500 },
    );
  }
}

// GET handler to query transactions by address and date range
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!address) {
      return NextResponse.json(
        { error: "Missing address parameter" },
        { status: 400 },
      );
    }

    const whereClause: {
      address: string;
      timeStamp?: { gte?: Date; lte?: Date };
    } = {
      address: address.toLowerCase(),
    };

    // Add date range filters if provided
    if (startDate) {
      whereClause.timeStamp = {
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      whereClause.timeStamp = {
        ...whereClause.timeStamp,
        lte: new Date(endDate),
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: {
        timeStamp: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return NextResponse.json(
      { error: "Failed to retrieve transactions" },
      { status: 500 },
    );
  }
}
