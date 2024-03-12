import { React, useState } from 'react'

const { ethers } = require('ethers')

const Main = (props) => {
  const [tokenAmount, setTokenAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const tokenDecimals = 6 // MT3 token has 6 decimals
  // const rwdTokenDecimals = 18 // MT1 token has 18 decimals



  const handleChange = (event) => {
    setTokenAmount(event.target.value)
  }

  const handleStakeTokens = async () => {
    if (!tokenAmount || isNaN(tokenAmount) || parseFloat(tokenAmount) <= 0) {
      setError('Please enter a valid tokenAmount')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Convert the token tokenAmount to the token's smallest unit (e.g., wei)
      
      const tokenAmountWei = ethers.parseUnits(tokenAmount, tokenDecimals)

      // Call the stakeTokens function on the contract
      await props.stakeTokens(tokenAmountWei)

      // Clear the tokenAmount field
      setTokenAmount('')
    } catch (error) {
      console.error('Error staking tokens:', error.message)
      setError('Error staking tokens1')
    } finally {
      setLoading(false)
    }
  }

  const handleUnstake = async () => {
    try {
      setLoading(true)
      setError('')

      // Call the unstake function on the smart contract

      await props.unstakeTokens()
    } catch (error) {
      console.error('Error unstaking tokens:', error.message)
      setError('Error unstaking tokens')
    } finally {
      setLoading(false)
    }
  }

  const handleClaimRewards = async () => {
    try {
      setLoading(true)
      setError('')

      // Call the claimRewards function on the smart contract
      await props.claimRewards()
    } catch (error) {
      console.error('Error claiming rewards1:', error.message)
      setError('Error claiming rewards1')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="staking-platform container-fluid">
      <div className="box1 container-fluid">
        <h1>Stake Tokens</h1>
        <div className="container-fluid">
          <input className ='input' type="number" value={tokenAmount} onChange={handleChange} />
          <button className='button' onClick={handleStakeTokens} disabled={loading}>
            Stake
          </button>
          {error && <p className="error">{error}</p>}
          {loading && <p className="loading">Loading...</p>}
        </div>
      </div>
      <div className="box2 container-fluid">
        <h1>Unstake Tokens</h1>
        <div className=" box21 container-fluid">
          <p> Tokens Staked: {ethers.formatUnits(props.stakerInfo.stakedAmount.toString(), 6).toString()} MT1</p>
          <p> Reward Tokens to  claim: {ethers.formatUnits(props.stakerInfo.unclaimedRewards.toString(), 18).toString()} MT3</p>
          
          
          <button className='button' onClick={handleUnstake} disabled={loading}>
            Unstake
          </button>
          {loading && <p className="loading">Loading...</p>}
        </div>
      </div>
      <div className="box3 container-fluid">
        <h1>Claim Rewards</h1>
        <div className="container-fluid">
        <p> Reward Tokens to  claim: {ethers.formatUnits(props.stakerInfo.unclaimedRewards.toString(), 18).toString()} MT3</p>
          <button className='button' onClick={handleClaimRewards} disabled={loading}>
            Claim Rewards
          </button>
          {loading && <p className="loading">Loading...</p>}
        </div>
      </div>
    </div>

    // <div className="main1 container-fluid">
    //   <div>
    //     <label>
    //       Amount to Stake:
    //       <input
    //         type="number"
    //         value={tokenAmount}
    //         onChange={handleChange}
    //         disabled={loading}
    //       />
    //     </label>
    //     <button onClick={handleStakeTokens} disabled={loading}>
    //       {loading ? 'Staking...' : 'Stake Tokens'}
    //     </button>
    //     {error && <p style={{ color: 'red' }}>{error}</p>}
    //   </div>
    // </div>
  )
}

export default Main
