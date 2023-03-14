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

              await deployments.fixture(["all"])

              gardenContract = await ethers.getContractFactory("GardenNFT")
              gardenNft = await gardenContract.deploy(mintPrice)
          })
          it("was deployed", async () => {
              assert(gardenNft.address)
          })
          describe("Constructor", () => {
              it("Initializes the NFT Correctly", async () => {
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
              it("can collect mint fees", async function () {
                  const fee = ethers.utils.formatEther(mintPrice) * nftAmount

                  const gardenNftConnectedContract = await gardenNft.connect(user1)

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
          })
      })
