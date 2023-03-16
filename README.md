# Simple NFT staking dApp

[Demo dApp](https://simple-nft-staking-dapp.vercel.app/)

This project is a simple decentralized application (DApp) that allows users to stake their non-fungible tokens (NFTs) and earn rewards in the form of a second NFT token. The project uses the Ethereum blockchain and the IPFS network for storing NFT images.

## Getting Started

To use this DApp, you will need a compatible Ethereum wallet such as Metamask and some test Ether to interact with the smart contract.

To set up the project, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Compile the smart contract by running `npx hardhat compile`.
4. Deploy the smart contract to your local network by running `npx hardhat node` to start a local blockchain node, and then running `npx hardhat run scripts/deploy.js --network localhost` to deploy the contract.
5. Start the DApp by running `npm start`.

## Usage

Once you have the DApp running, you can stake your NFTs by following these steps:

1. Connect your Ethereum wallet to the DApp.
2. Choose an NFT from your wallet to stake.
3. Specify the amount of time you want to stake your NFT for and confirm the transaction.
4. Wait for the staking period to end.
5. Claim your reward NFT.

## Smart Contract Details

The smart contract is written in Solidity and is based on OpenZeppelin contracts for increased security and reliability. The contract supports the following functions:

* `stake(uint256 tokenId, uint256 duration)` - Stake an NFT with the specified ID for the specified duration.
* `unstake(uint256 tokenId)` - Unstake an NFT with the specified ID.
* `getStakedTokens(address account)` - Get a list of NFT tokens staked by the specified account.
* `getStakedToken(address account, uint256 index)` - Get the details of the staked token at the specified index in the account's list.
* `getTotalRewards(address account)` - Get the total number of reward NFTs earned by the specified account.
* `claimReward()` - Claim the reward NFTs earned by the caller.

## Contributing

Contributions to this project are welcome. To contribute, please fork the repository, make your changes, and submit a pull request.
