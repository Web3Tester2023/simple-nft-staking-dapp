const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, INITIAL_SUPPLY } = require("../helper-hardhat-config")
// const { moveBlocks } = require("../utils/move-blocks")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("ERC20 Token Unit Tests", function () {
          let token, tokenContract

          const multiplier = 10 ** 18

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user1 = accounts[1]

              await deployments.fixture(["all"])

              tokenContract = await ethers.getContractFactory("Token")
              token = await tokenContract.deploy(INITIAL_SUPPLY)
          })

          it("was deployed", async () => {
              assert(token.address)
          })
          describe("constructor", () => {
              it("Should have correct INITIAL_SUPPLY of token ", async () => {
                  const totalSupply = await token.totalSupply()
                  assert.equal(totalSupply.toString(), INITIAL_SUPPLY)
              })
              it("initializes the token with the correct name and symbol ", async () => {
                  const name = (await token.name()).toString()
                  assert.equal(name, "Roses")

                  const symbol = (await token.symbol()).toString()
                  assert.equal(symbol, "ROSES")
              })
          })
      })
