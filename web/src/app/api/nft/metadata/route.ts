// app/api/nft/metadata/route.ts

import { type NextRequest, NextResponse } from "next/server"; // Import Next.js types for request and response
import { PrismaClient } from "@prisma/client"; // Import PrismaClient for database interactions
import { createPublicClient, http, type Address } from "viem"; // Import viem for blockchain interactions
import { mainnet } from "viem/chains"; // Import Ethereum mainnet chain configuration
import { erc721Abi } from "viem"; // Import the ERC-721 ABI
import { env } from "~/env"; // Import environment variables
import { Buffer } from "buffer"; // Import Buffer for decoding data URIs

// Ensure Buffer is available globally (necessary in some environments)
if (!global.Buffer) {
  global.Buffer = Buffer;
}

const prisma = new PrismaClient(); // Initialize Prisma Client for database operations

// Create a public client to interact with the Ethereum network
const client = createPublicClient({
  chain: mainnet, // Specify the Ethereum mainnet; change to 'goerli' for testnet
  transport: http(env.INFURA_ETHEREUM_MAINNET_URL ?? ""), // Use Infura as the HTTP provider
});

// Define the expected shape of the request body
type RequestBody = {
  contractAddress: string; // The Ethereum address of the NFT contract
  tokenId: string; // The token ID of the NFT
};

// Define the expected shape of the NFT metadata
type NFTMetadataResponse = {
  name?: string; // Name of the NFT (optional)
  description?: string; // Description of the NFT (optional)
  image: string; // Image URL of the NFT
  [key: string]: unknown; // Allow additional properties
};

// Export the POST handler function for the API route
export async function POST(req: NextRequest) {
  try {
    // Parse the request body as JSON
    const body = (await req.json()) as RequestBody;
    const { contractAddress, tokenId } = body; // Destructure contractAddress and tokenId from the body

    // Validate that both contractAddress and tokenId are provided
    if (!contractAddress || !tokenId) {
      return NextResponse.json(
        { error: "Missing contract address or token ID" }, // Return an error message
        { status: 400 }, // Set the HTTP status code to 400 Bad Request
      );
    }

    // Format the contract address to lowercase and assert it as an Address type
    const contractAddressFormatted = contractAddress.toLowerCase() as Address;
    const tokenIdBigInt = BigInt(tokenId); // Convert the tokenId to BigInt for blockchain interaction

    // Define the ERC-721 contract instance with address and ABI
    const contract = {
      address: contractAddressFormatted, // The contract address of the NFT
      abi: erc721Abi, // The standard ERC-721 ABI
    };

    // Fetch the token URI from the contract
    let tokenUri: string = await client.readContract({
      address: contract.address, // Contract address
      abi: contract.abi, // Contract ABI
      functionName: "tokenURI", // The function to call on the contract
      args: [tokenIdBigInt], // Arguments for the function call (tokenId)
    });

    // Handle different URI schemes that might be returned from tokenURI
    if (tokenUri.startsWith("ipfs://")) {
      // If the URI is an IPFS URI, replace it with a public IPFS gateway URL
      tokenUri = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
    } else if (tokenUri.startsWith("ar://")) {
      // If the URI is an Arweave URI, replace it with Arweave gateway URL
      tokenUri = tokenUri.replace("ar://", "https://arweave.net/");
    }

    let metadata: NFTMetadataResponse; // Variable to hold the NFT metadata

    if (tokenUri.startsWith("data:application/json;base64,")) {
      // If the tokenUri is a data URI containing base64-encoded JSON
      const base64Data = tokenUri.substring(
        "data:application/json;base64,".length, // Extract the base64 string from the URI
      );
      const jsonString = Buffer.from(base64Data, "base64").toString("utf-8"); // Decode the base64 string to JSON
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      metadata = JSON.parse(jsonString); // Parse the JSON string into an object
    } else {
      // Fetch metadata from the token URI (HTTP or HTTPS URL)
      const metadataResponse = await fetch(tokenUri);

      // Check if the HTTP response status is OK (200-299)
      if (!metadataResponse.ok) {
        // If not, throw an error to be caught in the catch block
        throw new Error(`HTTP error! Status: ${metadataResponse.status}`);
      }

      // Parse the metadata JSON from the response
      metadata = (await metadataResponse.json()) as NFTMetadataResponse;
    }

    // Fetch the contract's name (e.g., "Bored Ape Yacht Club")
    const contractName: string = await client.readContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "name",
      args: [],
    });

    // Extract and process the image URL from the metadata
    let imageUrl = metadata.image || ""; // Get the image URL from metadata, default to empty string if undefined

    // Handle different URI schemes in the image URL
    if (imageUrl.startsWith("ipfs://")) {
      // If the image URL is an IPFS URI, replace it with a public IPFS gateway URL
      imageUrl = imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
    } else if (imageUrl.startsWith("ar://")) {
      // If the image URL is an Arweave URI, replace it with Arweave gateway URL
      imageUrl = imageUrl.replace("ar://", "https://arweave.net/");
    }

    // Parse name and description from metadata, ensure they are strings
    let name = typeof metadata.name === "string" ? metadata.name : "";
    let description =
      typeof metadata.description === "string" ? metadata.description : "";

    // If name is missing, construct it using contract's name and token ID
    if (!name || name.trim() === "") {
      name = `${contractName} #${tokenId}`;
    }

    // If description is missing, you may choose to set a default or leave it empty
    if (!description || description.trim() === "") {
      description = ""; // Or set a default description if desired
    }

    // Store the NFT metadata in the MongoDB database using Prisma
    const storedMetadata = await prisma.nFTMetadata.create({
      data: {
        contractAddress: contractAddressFormatted, // Store the contract address
        tokenId: tokenId, // Store the token ID
        name: name, // Store the name of the NFT
        description: description, // Store the description of the NFT
        imageUrl: imageUrl, // Store the processed image URL
      },
    });

    // Return the stored metadata as a JSON response
    return NextResponse.json(storedMetadata);
  } catch (error) {
    // Log any errors to the console for debugging
    console.error("Error retrieving or storing NFT metadata:", error);
    // Return a generic error message to the client
    return NextResponse.json(
      { error: "Failed to retrieve NFT metadata" }, // Error message
      { status: 500 }, // Set the HTTP status code to 500 Internal Server Error
    );
  }
}
