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
      "0x13dbf15cb11aa819912f79df9027e4c225ad4543a5a19c4bff1e9e5b694b01e6"
    );

    return {merkle, token, owner, acc1};
  }

  describe("Deployment", function() {
    

    it("Should deploy with an owner set", async function() {
      const {merkle, owner} = await loadFixture(deployMerkle);

      expect(await merkle.owner()).to.equal(owner);
    })

    it("Should deploy with an nft address set", async function() {
      const {merkle} = await loadFixture(deployMerkle);

      expect(await merkle.nftTokenAddress()).to.equal("0xaBA7161A7fb69c88e16ED9f455CE62B791EE4D03");
    })

    it("Should deploy with a token address set", async function() {
      const {merkle, token} = await loadFixture(deployMerkle);

      expect(await merkle.tokenAddress()).to.equal(token);
    })

    it("Should deploy with merkle tree set", async function() {
      const {merkle, owner} = await loadFixture(deployMerkle);

      expect(await merkle.merkleRoot()).to.equal("0x13dbf15cb11aa819912f79df9027e4c225ad4543a5a19c4bff1e9e5b694b01e6");
    })

  })

});
