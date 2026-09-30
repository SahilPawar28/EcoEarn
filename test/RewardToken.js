const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RewardToken", function () {
  async function deployFixture() {
    const [owner, center, retailer, recycler, customer, stranger] = await ethers.getSigners();
    const RewardToken = await ethers.getContractFactory("RewardToken");
    const token = await RewardToken.deploy(owner.address);
    await token.waitForDeployment();
    return { token, owner, center, retailer, recycler, customer, stranger };
  }

  it("mints the initial supply to the owner", async function () {
    const { token, owner } = await deployFixture();
    expect(await token.balanceOf(owner.address)).to.equal(ethers.parseUnits("1000000", 18));
  });

  it("lets the owner authorize a recycling center", async function () {
    const { token, owner, center } = await deployFixture();
    await token.connect(owner).addRecyclingCenter(center.address);
    expect(await token.isRecyclingCenter(center.address)).to.equal(true);
  });

  it("rejects authorization changes from a non-owner", async function () {
    const { token, stranger, center } = await deployFixture();
    await expect(token.connect(stranger).addRecyclingCenter(center.address)).to.be.reverted;
  });

  it("lets an authorized center reward a recycler", async function () {
    const { token, owner, center, recycler } = await deployFixture();
    await token.connect(owner).addRecyclingCenter(center.address);
    await token.connect(center).rewardRecycler(recycler.address, 10);
    expect(await token.balanceOf(recycler.address)).to.equal(ethers.parseUnits("10", 18));
  });

  it("blocks an unauthorized address from rewarding recyclers", async function () {
    const { token, center, recycler } = await deployFixture();
    await expect(token.connect(center).rewardRecycler(recycler.address, 10)).to.be.revertedWith(
      "Not an authorized center"
    );
  });

  it("requires customer approval before a retailer can redeem tokens", async function () {
    const { token, owner, retailer, customer } = await deployFixture();
    await token.connect(owner).addRetailer(retailer.address);
    await token.connect(owner).transfer(customer.address, ethers.parseUnits("50", 18));

    await expect(
      token.connect(retailer).redeemTokens(customer.address, 10)
    ).to.be.reverted; // no allowance granted yet

    await token.connect(customer).approve(retailer.address, ethers.parseUnits("10", 18));
    await token.connect(retailer).redeemTokens(customer.address, 10);

    expect(await token.balanceOf(retailer.address)).to.equal(ethers.parseUnits("10", 18));
    expect(await token.balanceOf(customer.address)).to.equal(ethers.parseUnits("40", 18));
  });

  it("blocks an unauthorized address from redeeming tokens", async function () {
    const { token, retailer, customer } = await deployFixture();
    await expect(token.connect(retailer).redeemTokens(customer.address, 10)).to.be.revertedWith(
      "Not an authorized retailer"
    );
  });
});
