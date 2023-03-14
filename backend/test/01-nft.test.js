const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
// const { moveBlocks } = require("../utils/move-blocks")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Garden NFT Unit Tests", function () {
          let deployer
          const mintPrice = ethers.utils.parseEther("0.1")
          const nftAmount = 5
          const tokenId = 50

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user1 = accounts[1]
              user2 = accounts[2]

              await deployments.fixture(["all"])

              gardenContract = await ethers.getContractFactory("GardenNFT")
              gardenNft = await gardenContract.deploy(mintPrice)
          })
          it("was deployed", async () => {
              assert(gardenNft.address)
          })
          describe("Constructor", () => {
              it("sets NFT mint price correctly", async () => {
                  const _mintPrice = ethers.utils.formatEther(await gardenNft.mintPrice())
                  assert.equal(_mintPrice, ethers.utils.formatEther(mintPrice))
              })
          })
          describe("Mint NFT", () => {
              it("can mint batch NFT", async function () {
                  const fee = ethers.utils.formatEther(mintPrice) * nftAmount

                  const txResponse = await gardenNft
                      .connect(user1)
                      .mint(tokenId, nftAmount, { value: ethers.utils.parseEther(fee.toString()) })
                  await txResponse.wait(1)
              })
          })

          describe("Only Owner", () => {
              beforeEach(async () => {
                  fee = ethers.utils.formatEther(mintPrice) * nftAmount
                  gardenNftConnectedContract = await gardenNft.connect(user1)
              })

              it("can collect mint fees", async function () {
                  // user mint NFTs
                  const txResponse = await gardenNftConnectedContract.mint(tokenId, nftAmount, {
                      value: ethers.utils.parseEther(fee.toString()),
                  })
                  await txResponse.wait(1)

                  // can't access function if not the owner
                  await expect(gardenNftConnectedContract.collectFee()).to.be.revertedWith(
                      "NotOwner()"
                  )

                  // if owner, can withdraw fee from contract
                  const tx = await gardenNft.connect(deployer).collectFee()
                  await tx.wait(1)
              })
              it("can transfer ownership of the contract", async function () {
                  // can't access function if not the owner
                  await expect(
                      gardenNftConnectedContract.transferOwnership(user2.address)
                  ).to.be.revertedWith("NotOwner()")

                  // if owner, can transfer ownership
                  const tx = await gardenNft.connect(deployer).transferOwnership(user2.address)
                  await tx.wait(1)
                  const newOwner = await gardenNft.owner()
                  assert.equal(newOwner, user2.address)
              })
              it("can pause contract in case of emergency", async () => {
                  // can't access function if not the owner
                  await expect(gardenNftConnectedContract.setPaused(true)).to.be.revertedWith(
                      "NotOwner()"
                  )
                  // if owner, can set pause in case of emergency
                  const tx = await gardenNft.connect(deployer).setPaused(true)
                  const contractPause = await gardenNft._paused()
                  assert.equal(contractPause, true)

                  // users can't call mint function, if contract is paused
                  const tx2 = gardenNftConnectedContract.mint(tokenId, nftAmount, {
                      value: ethers.utils.parseEther(fee.toString()),
                  })
                  await expect(tx2).to.be.revertedWith("ContractPaused()")
              })
              it("can set new NFT URI", async () => {
                  // can't access function if not the owner
                  await expect(
                      gardenNftConnectedContract.setURI("ipfs://newUri")
                  ).to.be.revertedWith("NotOwner()")
                  // if owner, can set new NFT URI
                  const tx1 = await gardenNft.connect(deployer).setURI("ipfs://newUri")

                  // user1 mint NFTs with new Uri
                  const fee = ethers.utils.formatEther(mintPrice) * nftAmount
                  const tx2 = await gardenNftConnectedContract.mint(tokenId, nftAmount, {
                      value: ethers.utils.parseEther(fee.toString()),
                  })
                  const nftUri = await gardenNftConnectedContract.uri(tokenId)
                  assert.equal(nftUri, "ipfs://newUri")
              })
          })
      })
