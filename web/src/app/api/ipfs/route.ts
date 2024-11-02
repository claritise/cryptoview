// app/api/ipfs/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { unixfs } from "@helia/unixfs";
import { createHeliaHTTP } from "@helia/http";
import { verifiedFetch } from "@helia/verified-fetch";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = (await req.json()) as { content: string };
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Missing content parameter" },
        { status: 400 },
      );
    }

    // Create a Helia node using HTTP
    const helia = await createHeliaHTTP();

    // Create a UnixFS instance
    const fs = unixfs(helia);

    // Add content to IPFS
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const cid = await fs.addBytes(data);

    const ipfsHash = cid.toString();

    // Store the data and IPFS hash in MongoDB using Prisma
    await prisma.iPFSData.create({
      data: {
        data: content,
        ipfsHash: ipfsHash,
      },
    });

    return NextResponse.json({
      message: "Content stored on IPFS successfully",
      ipfsHash: ipfsHash,
    });
  } catch (error) {
    console.error("Error storing content on IPFS:", error);
    return NextResponse.json(
      { error: "Failed to store content on IPFS" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ipfsHash = searchParams.get("hash");

    if (!ipfsHash) {
      return NextResponse.json(
        { error: "Missing hash parameter" },
        { status: 400 },
      );
    }

    // Retrieve the data from MongoDB using the IPFS hash
    const storedData = await prisma.iPFSData.findFirst({
      where: { ipfsHash: ipfsHash },
    });

    if (storedData) {
      // Return the data from the database
      return NextResponse.json({
        ipfsHash: storedData.ipfsHash,
        content: storedData.data,
      });
    }

    // If not found in the database, fetch from IPFS using verifiedFetch
    const response = await verifiedFetch(`ipfs://${ipfsHash}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch content from IPFS: ${response.statusText}`,
      );
    }

    const content = await response.text();

    // Optionally, you could store the fetched content in the database here

    return NextResponse.json({
      ipfsHash: ipfsHash,
      content: content,
    });
  } catch (error) {
    console.error("Error retrieving content:", error);
    return NextResponse.json(
      { error: "Failed to retrieve content" },
      { status: 500 },
    );
  }
}
