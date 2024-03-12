import React, { useEffect, useState } from 'react'
import Staking from './Staking.json'
import Navbar from './components/Navbar'
import Main from './components/Main'
import StakingToken from './tokenABI.json'

const ethers = require('ethers')

function App() {
  const [stakingDetails, setStakingDetails] = useState(null)
  const [stakerInfo, setStakerInfo] = useState(null)
  const [address, setAddress] = useState(null)
  const [contract, setContract] = useState(null)
  const [contractToken, setContractToken] = useState(null)
  const contractAddress = '0x80172E1828fEB51267a7B938AE5a61cA6c0946CE' // address of the staking smart contract
  const tokenContractAddress = '0x3eaC1E98dd13F76DC238DBbfe2F1A5E5672C14db' // address of the ERC20 smart contract

  useEffect(() => {
    const initializeProvider = async () => {
      // reqquest to access metamask accounts
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        console.log('Connected with metamask wallet')
        const provider = new ethers.BrowserProvider(window.ethereum)

        // Access the signer (user account)
        const signer = await provider.getSigner()

        // Get the user's address
        const add = await signer.getAddress()
        setAddress(add)
        console.log('Connected address:', add)

        // Connect to the staking contract

        const abi = Staking.abi
        const contract = new ethers.Contract(contractAddress, abi, signer)
        setContract(contract)

        const tokenAbi = StakingToken.abi
        const contractToken = new ethers.Contract(
          tokenContractAddress,
          tokenAbi,
          signer,
        )

        setContractToken(contractToken)
        const balance = await contractToken.balanceOf(add)
        console.log(balance)

        // Function to get details from the staking contract
        const getStakingDetails = async () => {
          try {
            // Call the getDetails function on the smart contract
            const details = await contract.getDetails()
            console.log('Staking details:', details)
            if (details) {
              setStakingDetails(details)
            }
          } catch (error) {
            console.error('Error getting staking details:', error)
            return null
          }
        }

        // Function to get staker info
        const getStakerInfo = async (add) => {
          try {
            // Call the getStakerInfo function on the smart contract
            const stakerInfo = await contract.getStakerInfo(add)
            console.log('Staker info:', stakerInfo)
            if (stakerInfo) {
              setStakerInfo(stakerInfo)
            }
          } catch (error) {
            console.error('Error getting staker info:', error)
            return null
          }
        }

        getStakingDetails()
        getStakerInfo(add)

        // async function checkBalance() {
        //   const balance = await provider.getBalance(add)
        //   console.log(ethers.formatEther(balance))
        // }

        // await checkBalance()
      } else {
        console.log('Metamask wallet is not connected')
      }
    }

    initializeProvider().catch((error) => console.error('UE1', error))
  }, [])

  // Stake function
  const stakeTokens = async (amount) => {
    try {
      const tx1 = await contractToken.approve(contractAddress, amount)
      await tx1.wait()

      const tx2 = await contract.stake(amount)
      await tx2.wait()
      console.log('Staked successfully!')
    } catch (error) {
      console.error('Error staking tokens0:', error)
    }
  }

  // Unstake function
  const unstakeTokens = async () => {
    try {
      // Call the unstake function on the smart contract
      const tx = await contract.unstake()
      await tx.wait()
      console.log('Unstaked successfully!')
    } catch (error) {
      console.error('Error unstaking tokens:', error)
    }
  }

  // Claim rewards function
  const claimRewards = async () => {
    try {
      // Call the claimRewards function on the smart contract
      const tx = await contract.claimRewards()
      await tx.wait()
      console.log('Rewards claimed successfully!')
    } catch (error) {
      console.error('Error claiming rewards0:', error)
    }
  }

  return (
    <div className="App">
      <Navbar address={address} />

      { (stakingDetails && stakerInfo) ? (
        <Main
          stakingDetails={stakingDetails}
          stakerInfo={stakerInfo}
          stakeTokens={stakeTokens}
          unstakeTokens={unstakeTokens}
          claimRewards={claimRewards}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default App
