# Simple NFT staking dApp

[Demo dApp](https://simple-nft-staking-dapp.vercel.app/)

This is a decentralized staking platform. Users can buy ERC1155 tokens and stake them to receive limited ERC20 tokens. There's no limit to buy ERC1155 as well as staking and unstaking them.

Rewards are calculated using the following formula:

```bash

Pending reward = Number NFT staked * Reward per block * (Current block number - last update block number),

```

where `last update block number` is when user last time called mutable function such as stake, unstake and claim.

### How to install and use

To set up the repository and run project locally, run the below

```bash

git clone https://github.com/AnastasiaMenshikova/simple-nft-staking-dapp

cd simple-nft-staking-dapp

yarn install

yarn start

```
