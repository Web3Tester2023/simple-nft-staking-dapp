const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Garden NFT Unit Tests", function () {
          let cuteDogNft, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["all"])
              gardenNft = await ethers.getContract("GardenNFT")
          })

          describe("Constructor", () => {
              it("Initializes the NFT Correctly", async () => {
                  const name = await gardenNft.name()
                  const symbol = await gardenNft.symbol()
                  const tokenCounter = await gardenNft.getTokenCounter()
                  assert.equal(name, "GardenNFT")
                  assert.equal(symbol, "GRDN")
                  assert.equal(tokenCounter.toString(), "0")
              })
          })
          //test02
          //   describe("Mint NFT", () => {
          //       beforeEach(async () => {
          //           const txResponse = await gardenNft.mintNft()
          //           await txResponse.wait(1)
          //       })
          //       it("Allows users to mint an NFT, and updates appropriately", async function () {
          //           const tokenURI = await gardenNft.tokenURI(0)
          //           const tokenCounter = await gardenNft.getTokenCounter()

          //           assert.equal(tokenCounter.toString(), "1")
          //           assert.equal(tokenURI, await gardenNft.TOKEN_URI())
          //       })
          //       it("Show the correct balance and owner of an NFT", async function () {
          //           const deployerAddress = deployer.address
          //           const deployerBalance = await gardenNft.balanceOf(deployerAddress)
          //           const owner = await gardenNft.ownerOf("0")

          //           assert.equal(deployerBalance.toString(), "1")
          //           assert.equal(owner, deployerAddress)
          //       })
          //   })
      })
