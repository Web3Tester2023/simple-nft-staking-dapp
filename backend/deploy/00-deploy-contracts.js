const { network, ethers } = require("hardhat")
const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    INITIAL_SUPPLY,
    NFT_KEY,
    BLOCK_REWARD,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")
    const token = await deploy("Token", {
        from: deployer,
        args: [INITIAL_SUPPLY],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    const mintPrice = ethers.utils.parseEther("1")

    const nft = await deploy("GardenNFT", {
        from: deployer,
        args: [mintPrice],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    const stakingArgs = [token.address, nft.address, INITIAL_SUPPLY, BLOCK_REWARD, NFT_KEY]

    const nftStaking = await deploy("NftStaking", {
        from: deployer,
        args: stakingArgs,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })
}

module.exports.tags = ["all"]
