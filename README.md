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
