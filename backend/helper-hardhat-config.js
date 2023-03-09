const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const INITIAL_SUPPLY = "1000000000000000000000000" // 1 000 000 tokens
const NFT_KEY = "0000000000000000000000000000000000000000000000000000000000000500"
const BLOCK_REWARD = "1000000000000" // 1000 Gwei = 10 ** 12 Wei, can be changed after deploy

module.exports = {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    INITIAL_SUPPLY,
    NFT_KEY,
    BLOCK_REWARD,
}
