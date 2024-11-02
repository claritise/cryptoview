# cryptoview

Here are some challenge ideas that avoid complexity, can be solved using web3.js or APIs, and focus on backend code using Express.js and MongoDB.
Choose 3 tasks that you are confident in and can do.

**1. NFT Metadata Retrieval and Storage:**

- **The Challenge:** Create an API endpoint that accepts an NFT contract address and token ID. It should retrieve the metadata (name, description, image URL) from the blockchain using web3.js, store it in MongoDB, and return the metadata to the user.
- **Focus:** Demonstrates understanding of web3.js interaction with smart contracts, handling data from blockchain, and basic database integration.

## **Notes:**

### **Overview**

- **Purpose:** Retrieve NFT metadata (name, description, image) from the blockchain, store in MongoDB, and return to the user. Only supports ETH mainnet for now (can be extended to other networks).
- **Technologies:** Uses `viem` for blockchain interaction, Prisma for database storage, and TypeScript for type safety.

### **API Endpoint**

- **Method:** `POST`
- **URL:** `/api/nft/metadata`
- **Request Parameters:**
  - `contractAddress`: Ethereum contract address of the NFT collection.
  - `tokenId`: Specific token ID within the collection.

### **Functionality**

- **Metadata Retrieval:**

  - Fetches the `tokenURI` from the NFT contract.
  - Supports `ipfs://`, `ar://`, and `data:` URI schemes.
  - If `name` or `description` is missing, attempts to use the contract’s name or constructs a name with `tokenId`.

- **Data Storage:**

  - Stores `contractAddress`, `tokenId`, `name`, `description`, and `imageUrl` in MongoDB via Prisma.

- **Error Handling:**
  - Logs errors and returns a 500 response on failure.

### **Test Commands**

```bash
curl -X POST http://localhost:3000/api/nft/metadata \
  -H 'Content-Type: application/json' \
  -d '{"contractAddress": "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", "tokenId": "1"}'

curl -X POST http://localhost:3000/api/nft/metadata \
  -H 'Content-Type: application/json' \
  -d '{"contractAddress": "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e", "tokenId": "1"}'
```

**2. Simple Cryptocurrency Transaction Tracking:**

- **The Challenge:** Build an API endpoint that accepts a cryptocurrency address (Ethereum, for example). It should retrieve the last 5 transactions for that address from a blockchain explorer API (e.g., Etherscan) and store them in MongoDB. Allow users to query for transactions by address and date range.
- **Focus:** Exposes knowledge of external APIs, data parsing, and efficient database storage.

## **Notes:**

### **Overview**

- **Purpose:** Retrieve the last 5 transactions for a given Ethereum address using the Etherscan API, store them in MongoDB, and allow users to query transactions by address and date range. Currently supports Ethereum mainnet (can be extended to other networks).

- **Technologies:** Uses Node.js native `fetch` API for HTTP requests, Prisma for database storage, Next.js API routes for serverless functions, and TypeScript for type safety.

### **API Endpoints**

#### **1. Store Transactions**

- **Method:** `POST`
- **URL:** `/api/transactions`
- **Request Body Parameters:**
  - `address`: Ethereum address to retrieve transactions for.

#### **2. Query Transactions**

- **Method:** `GET`
- **URL:** `/api/transactions`
- **Query Parameters:**
  - `address`: Ethereum address to query transactions for.
  - `startDate` (optional): Start date for filtering transactions (`YYYY-MM-DD` format).
  - `endDate` (optional): End date for filtering transactions (`YYYY-MM-DD` format).

### **Functionality**

#### **Transaction Retrieval and Storage**

- **Retrieving Transactions:**

  - Fetches the last 5 transactions for the provided Ethereum address using the Etherscan API.
  - Parses and validates the API response.
  - Supports error handling for API failures or invalid responses.

- **Data Storage:**

  - Stores transaction details in MongoDB via Prisma.
  - Uses `upsert` operation to avoid duplicate entries based on transaction hash.
  - Parses numeric strings to appropriate data types (e.g., `blockNumber` to `Int`, `timeStamp` to `Date`).

#### **Transaction Query**

- **Querying Transactions:**

  - Retrieves transactions from MongoDB based on the provided Ethereum address.
  - Allows optional filtering by `startDate` and `endDate`.
  - Returns transactions sorted by timestamp in descending order.
  - Supports pagination or limits (can be extended as needed).

#### **Error Handling**

- **Server-side Validation:**

  - Validates input parameters (e.g., checks if `address` is provided).
  - Returns a 400 response if required parameters are missing or invalid.

- **API Error Handling:**

  - Checks for errors in the Etherscan API response.
  - Logs detailed error messages on the server.
  - Returns a 500 response with a generic error message to the client.

- **Database Error Handling:**

  - Catches and logs any database errors during storage or retrieval.
  - Ensures the API remains robust against data inconsistencies.

### **Test Commands**

Use the following `curl` command to test the POST endpoint:

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H 'Content-Type: application/json' \
  -d '{"address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"}'

curl -X GET 'http://localhost:3000/api/transactions?address=0x742d35Cc6634C0532925a3b844Bc454e4438f44e'

curl -X GET 'http://localhost:3000/api/transactions?address=0x742d35Cc6634C0532925a3b844Bc454e4438f44e&startDate=2023-10-01&endDate=2023-10-31'
```

**3. Decentralized Storage (IPFS Integration):**

- **The Challenge:** Create an API endpoint that allows users to store text data on IPFS using the IPFS API. The endpoint should store the IPFS hash of the data in MongoDB and provide a way for users to retrieve the data using the stored hash.
- **Focus:** Demonstrates understanding of decentralized storage concepts, integrating with external APIs, and data persistence.

## **Notes:**

### **Overview**

- **Purpose:** Allow users to store text data on IPFS using Helia, store the data and the IPFS hash in MongoDB, and provide a way for users to retrieve the data using the stored IPFS hash. Demonstrates integration with decentralized storage solutions and data persistence.

- **Technologies:** Uses Helia and `@helia/verified-fetch` for IPFS interactions, Prisma for database storage, Next.js API routes for serverless functions, and TypeScript for type safety.

### **API Endpoints**

#### **1. Store Data on IPFS**

- **Method:** `POST`
- **URL:** `/api/ipfs`
- **Request Body Parameters:**
  - `content`: The text data to be stored on IPFS and in MongoDB.

#### **2. Retrieve Data from Database or IPFS**

- **Method:** `GET`
- **URL:** `/api/ipfs`
- **Query Parameters:**
  - `hash`: The IPFS hash of the content to retrieve.

### **Functionality**

#### **Data Storage**

- **Storing Content:**

  - Accepts text content via a POST request.
  - Adds the content to IPFS using Helia's `unixfs`.
  - Stores both the `content` and the resulting `ipfsHash` in MongoDB via Prisma.

#### **Data Retrieval**

- **Retrieving Content:**

  - Checks if the content is stored in MongoDB using the IPFS hash.
  - If found, returns the content from the database.
  - If not found, fetches the content from IPFS using `@helia/verified-fetch`.
  - Optionally, stores the fetched content in the database for future requests.

#### **Error Handling**

- **Server-side Validation:**

  - Validates input parameters (e.g., checks if `content` or `hash` is provided).
  - Returns appropriate HTTP status codes and error messages.

- **IPFS Error Handling:**

  - Catches and logs errors during IPFS operations.
  - Returns a 500 response with a generic error message to the client.

- **Database Error Handling:**

  - Catches and logs any database errors during storage or retrieval.
  - Ensures the API remains robust against data inconsistencies.

### **Test Commands**

#### **1. Store Data on IPFS**

Use the following `curl` command to test the POST endpoint:

```bash
curl -X POST http://localhost:3000/api/ipfs \
  -H 'Content-Type: application/json' \
  -d '{"content": "Hello, IPFS and MongoDB with Helia!"}'

curl -X GET 'http://localhost:3000/api/ipfs?hash=bafkreigp62idvjsufvmanfd6tgryj4dxxdvoykqj5pksi3dmflfq7cq6cm'
```

### **Some considerations given this is a simple imeplementation**

1. Data Availability and Persistence

   • Ephemeral Nodes:
   • Creating a new Helia node within each request (as done in the POST method) means the node is ephemeral. Once the request is completed, the node is destroyed.
   • Impact: The data you’ve added to IPFS may not be persisted across the network because the node that provided the data is no longer available.
   • Content Not Pinned:
   • Without pinning, there’s no guarantee that other IPFS nodes will store or retain your content.
   • Impact: The data may become inaccessible once your node goes offline, which can happen immediately after the request is processed.

2. Limited Network Participation

   • No DHT Participation:
   • When using createHeliaHTTP(), the Helia node communicates via HTTP gateways and may not participate in the Distributed Hash Table (DHT) of the IPFS network.
   • Impact: Your node doesn’t announce the availability of the content to the network, reducing the likelihood that other nodes will discover and cache your content.

3. Performance Considerations

   • Overhead of Node Creation:
   • Creating a new Helia node for each request can introduce significant overhead, affecting the performance of your API.
   • Impact: Increased latency and resource consumption, which can be especially problematic under high load.

4. Potential Data Loss

   • No Redundancy:
   • Since the data is not pinned or replicated, any failure in the node or network can result in data loss.
   • Impact: Users may not be able to retrieve their data when needed.

**4. Token Balance Lookup:**

- **The Challenge:** Build an API endpoint that accepts a token contract address and a wallet address. It should query the blockchain (using web3.js) to retrieve the balance of the specified token held by the wallet address and return the balance.
- **Focus:** Understanding of token contracts and token balance retrieval through web3.js.

**5. Basic Smart Contract Interaction:**

- **The Challenge:** Create a pre-deployed simple ERC20 token contract on a testnet. Build an API endpoint that allows users to transfer tokens between wallets using the contract. The endpoint should update the MongoDB database with the latest transaction data.
- **Focus:** Basic understanding of smart contract interactions, transaction handling, and integration with a blockchain.

**Important Considerations:**

- **Testnet:** For security and cost-effectiveness, use a blockchain testnet (like Rinkeby or Goerli for Ethereum).
- **Evaluation Criteria:** Define clear evaluation criteria for the challenge, such as code readability, efficiency, error handling, and adherence to best practices.

Let me know if you have any other specific requirements or scenarios you want to explore!

```

```
