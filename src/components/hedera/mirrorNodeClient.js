import { AccountId } from "@hashgraph/sdk";

// Interface definitions remain the same (no change needed)

export class MirrorNodeClient {
  constructor() {
    this.url = "https://testnet.mirrornode.hedera.com";
  }

  // Function to get token balances for an account
  // Returns: an array of MirrorNodeAccountTokenBalance
  async getAccountTokenBalances(AccountId) {
    const tokenBalanceInfo = await fetch(
      `${this.url}/api/v1/accounts/${AccountId}/tokens?limit=100`,
      { method: "GET" }
    );
    const tokenBalanceInfoJson = await tokenBalanceInfo.json();

    const tokenBalances = tokenBalanceInfoJson.tokens.map((balance) => ({
      ...balance,
    })); // Destructuring assignment for clarity

    // Pagination logic remains the same
    let nextLink = tokenBalanceInfoJson.links?.next;
    while (nextLink) {
      const nextTokenBalanceInfo = await fetch(`${this.url}${nextLink}`, {
        method: "GET",
      });
      const nextTokenBalanceInfoJson = await nextTokenBalanceInfo.json();
      tokenBalances.push(...nextTokenBalanceInfoJson.tokens);
      nextLink = nextTokenBalanceInfoJson.links?.next;
    }

    return tokenBalances;
  }

  // Function to get token info for a token
  // Returns: a MirrorNodeTokenInfo
  async getTokenInfo(tokenId) {
    const tokenInfo = await fetch(`${this.url}/api/v1/tokens/${tokenId}`, {
      method: "GET",
    });
    const tokenInfoJson = await tokenInfo.json();
    return tokenInfoJson;
  }

  // Function to get NFT info for an account
  // Returns: an array of NFTInfo
  async getNftInfo(accountId) {
    const nftInfo = await fetch(
      `${this.url}/api/v1/accounts/${accountId}/nfts?limit=100`,
      { method: "GET" }
    );
    const nftInfoJson = await nftInfo.json();

    const nftInfos = nftInfoJson.nfts.map((info) => ({ ...info })); // Destructuring assignment for clarity

    // Pagination logic remains the same
    let nextLink = nftInfoJson.links?.next;
    while (nextLink) {
      const nextNftInfo = await fetch(`${this.url}${nextLink}`, {
        method: "GET",
      });
      const nextNftInfoJson = await nextNftInfo.json();
      nftInfos.push(...nextNftInfoJson.nfts);
      nextLink = nextNftInfoJson.links?.next;
    }

    return nftInfos;
  }

  // Function to get token balances with token info
  // Returns: an array of MirrorNodeAccountTokenBalanceWithInfo
  async getAccountTokenBalancesWithTokenInfo(accountId) {
    // 1. Retrieve token balances
    const tokens = await this.getAccountTokenBalances(accountId);

    // 2. Create a map for token info and fetch info for each token
    const tokenInfos = new Map();
    for (const token of tokens) {
      const tokenInfo = await this.getTokenInfo(token.token_id);
      tokenInfos.set(tokenInfo.token_id, tokenInfo);
    }

    // 3. Fetch NFT info
    const nftInfos = await this.getNftInfo(accountId);

    // 4. Create a map for NFT serial numbers
    const tokenIdToSerialNumbers = new Map();
    for (const nftInfo of nftInfos) {
      const tokenId = nftInfo.token_id;
      const serialNumber = nftInfo.serial_number;

      if (!tokenIdToSerialNumbers.has(tokenId)) {
        tokenIdToSerialNumbers.set(tokenId, [serialNumber]);
      } else {
        tokenIdToSerialNumbers.get(tokenId).push(serialNumber);
      }
    }

    // 5. Combine data and return
    return tokens.map((token) => ({
      ...token,
      info: tokenInfos.get(token.token_id),
      nftSerialNumbers: tokenIdToSerialNumbers.get(token.token_id),
    }));
  }

  // Function to check if account is associated with a token
  // Returns: true if associated, false otherwise
  async isAssociated(accountId, tokenId) {
    const accountTokenBalance = await this.getAccountTokenBalances(accountId);
    return accountTokenBalance.some;
  }
}
