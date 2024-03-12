const {  hre, ethers } = require('hardhat')
const { expect } = require('chai')


describe('StakingContract', function () {
  let stakingContract
  let user

  beforeEach(async function () {
    // Get the signer accounts from Hardhat
    user = await ethers.getSigner();
    const contractAdd = "0x80172E1828fEB51267a7B938AE5a61cA6c0946CE"
    stakingContract = await  hre.ethers.getContractAt("Staking", contractAdd);
  })

  it('Should allow users to stake tokens', async function () {
    // Connect as a user and stake some tokens
    await stakingContract.connect(user).stake(100)

    // Check staker's staked amount
    const stakerInfo = await stakingContract.getStakerInfo(user.address)
    expect(stakerInfo.stakedAmount).to.equal(100)
  })

  it('Should allow users to unstake tokens', async function () {
    // Connect as a user and stake some tokens
    await stakingContract.connect(user).stake(100)

    // Unstake tokens
    await stakingContract.connect(user).unstake()

    // Check staker's staked amount after unstaking
    const stakerInfo = await stakingContract.getStakerInfo(user.address)
    expect(stakerInfo.stakedAmount).to.equal(0)
  })

  it('Should allow users to claim rewards', async function () {
    // Connect as a user and stake some tokens
    await stakingContract.connect(user).stake(100)

    // Wait for the claim delay
    await ethers.provider.send('evm_increaseTime', [claimDelay])
    await ethers.provider.send('evm_mine')

    // Claim rewards
    await stakingContract.connect(user).claimRewards()

    // Check staker's unclaimed rewards after claiming
    const stakerInfo = await stakingContract.getStakerInfo(user.address)
    expect(stakerInfo.unclaimedRewards).to.equal(0)
  })

  it('Should return staking details', async function () {
    // Get staking details
    const details = await stakingContract.getDetails()

    // Check if staking is paused
    expect(details.isPaused).to.be.false
    // Check other details...
  })

  it('Should return staker info', async function () {
    // Connect as a user and stake some tokens
    await stakingContract.connect(user).stake(100)

    // Get staker info
    const stakerInfo = await stakingContract.getStakerInfo(user.address)

    // Check staker info
    expect(stakerInfo.exist).to.be.true
    expect(stakerInfo.stakedAmount).to.equal(100)
    // Check other staker info...
  })
})
