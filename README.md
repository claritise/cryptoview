# cryptoview

Here are some challenge ideas that avoid complexity, can be solved using web3.js or APIs, and focus on backend code using Express.js and MongoDB.
Choose 3 tasks that you are confident in and can do.

**1. NFT Metadata Retrieval and Storage:**

- **The Challenge:** Create an API endpoint that accepts an NFT contract address and token ID. It should retrieve the metadata (name, description, image URL) from the blockchain using web3.js, store it in MongoDB, and return the metadata to the user.
- **Focus:** Demonstrates understanding of web3.js interaction with smart contracts, handling data from blockchain, and basic database integration.
- **Notes:**

### **Overview**

- **Purpose:** Retrieve NFT metadata (name, description, image) from the blockchain, store in MongoDB, and return to the user.
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

- curl -X POST http://localhost:3000/api/nft/metadata \
  -H 'Content-Type: application/json' \
  -d '{"contractAddress": "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", "tokenId": "1"}'

- curl -X POST http://localhost:3000/api/nft/metadata \
  -H 'Content-Type: application/json' \
  -d '{"contractAddress": "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e", "tokenId": "1"}'

**2. Simple Cryptocurrency Transaction Tracking:**

- **The Challenge:** Build an API endpoint that accepts a cryptocurrency address (Ethereum, for example). It should retrieve the last 5 transactions for that address from a blockchain explorer API (e.g., Etherscan) and store them in MongoDB. Allow users to query for transactions by address and date range.
- **Focus:** Exposes knowledge of external APIs, data parsing, and efficient database storage.

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
