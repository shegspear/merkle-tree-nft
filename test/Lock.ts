import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("MerkleTree", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployToken() {
    const [owner] = await hre.ethers.getSigners();

    const tokenFactory = await hre.ethers.getContractFactory("Web3CXI");

    const token = await tokenFactory.deploy();

    const amount = ethers.parseUnits("1000", 18);

    await token.mint(amount);
      
    return{token, owner}
  }

  async function deployMerkle() {
    const [owner, acc1] = await hre.ethers.getSigners();

    const {token} = await loadFixture(deployToken);

    const merkleFactory = await hre.ethers.getContractFactory("MerkleAirdrop");

    const merkle = await merkleFactory.deploy(
      "0xaBA7161A7fb69c88e16ED9f455CE62B791EE4D03",
      token,
      "0xaBA7161A7fb69c88e16ED9f455CE62B791EE4D03"
    );

    return {merkle, token, owner, acc1};
  }

  describe("Deployment", function() {

    it("Should deploy with an owner set", async function() {
      const {merkle, owner} = await loadFixture(deployMerkle);

      expect(await merkle.owner()).to.equal(owner);
    })

  })

});
