# Simple NFT staking dApp

[Demo dApp](https://simple-nft-staking-dapp.vercel.app/)

This project is a simple decentralized application (DApp) that allows users to stake their non-fungible tokens (NFTs) and earn rewards in ERC-20 standart tokens. NFTs follow the ERC1155 standart. The project uses the Celo blockchain (compatible with the Ethereum Virtual Machine) and the IPFS network for storing NFT images.

## Getting Started

To use this DApp, you will need a EVM-compatible wallet such as Metamask and some test Celo coins to interact with the smart contract.

To set up the project, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies by running `yarn install`.
3. Compile the smart contract by running `yarn compile`.
4. Deploy the smart contract to your local network by running `yarn local` or to Alfajores Testnet by running `yarn deploy`.
5. Start the DApp by running `yarn start`.

## Usage

Once you have the DApp running, you can stake your NFTs by following these steps:

1. Connect your wallet to the DApp.
2. Choose amount of NFTs to stake from your wallet and confirm the transaction.
3. Claim your reward in ERC-20 tokens.

There's no limit for staking period and how many NFTs you're going to stake, but reward pool is limited. If there's no rewards left, users can only unstake their NFTs, no staking will be allowed.

## Smart Contract Details

The smart contracts are written in Solidity and are based on OpenZeppelin contracts for increased security and reliability. The contract `NftStaking` supports the following functions:

- `stake(uint256 amount, bytes memory data)` - Stake selected amount of NFTs with the specified ID.
- `unstake(uint256 amount, bytes memory data)` - Unstake selected amount of NFTs with the specified ID.
- `claim()` - Claim the ERC-20 tokens reward earned by the caller.
- `earned(address user)` - Return amount of ERC-20 tokens earned by the user for frontend.
- `totalStaked()` - Returns number of NFTs staked in contract.
- `totalStakedFor(address addr)` - Returns number of NFTs staked by user.

## Contributing

Contributions to this project are welcome. To contribute, please fork the repository, make your changes, and submit a pull request.
