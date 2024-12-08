import React, { useState, useEffect } from 'react';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
// import { useWalletKit } from '@mysten/wallet-kit';
import { Transaction } from '@mysten/sui/transactions';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { myNetwork } from './sui_controller';

function Staking() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [message, setMessage] = useState('');
  const client = new SuiClient({ url: getFullnodeUrl('devnet') }); // Use 'testnet' or 'mainnet' as needed

  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  useEffect(() => {
    if (!currentAccount) {
      setMessage('Please connect your wallet');
    } else {
      setMessage('Wallet connected');
    }
  }, [currentAccount]);

  const stake = async () => {
    if (!currentAccount) {
      setMessage('Wallet not connected');
      return;
    }
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(Number(stakeAmount) * 1e9)]); // Convert to MIST
    
    tx.moveCall({
      target: 'your_contract_package::module_name::stake',
      arguments: [coin],
    });

    doTransaction(tx);
  }

  const unstake = async () => {
    if (!currentAccount) {
      setMessage('Wallet not connected');
      return;
    }
    const tx = new Transaction();
    
    tx.moveCall({
      target: 'your_contract_package::module_name::unstake',
      arguments: [tx.pure.u64(Number(unstakeAmount) * 1e9)], // Convert to MIST
    });

    doTransaction(tx);
  }

  const doTransaction = (tx: Transaction) => {
    signAndExecuteTransaction({
        transaction: tx,
        chain: `sui:${myNetwork}`,
      }, {
        onSuccess: (result) => {
          console.log('executed transaction', result);
          setMessage('Staking transaction sent: ' + result.digest);
          if (result.digest) {
            alert('Transaction successful!');
            // fetchPresaleState();
          }
        },
        onError: (error) => {
          console.log(error);
          setMessage('Error in staking: ' + error.message);
      }
      },);
  }

  return (
    <div className="presale-page-body">
        <div className="presale-container">
        {/* <div className="connectButtonWrapper"> */}
            <ConnectButton></ConnectButton>
		{/* </div> */}
      <h1>Sui Staking Frontend</h1>
      <p>{message}</p>

      
          <input 
            type="number" 
            value={stakeAmount} 
            onChange={(e) => setStakeAmount(e.target.value)} 
            placeholder="Stake amount in SUI" 
          />
          <button onClick={stake}>Stake</button>

          <input 
            type="number" 
            value={unstakeAmount} 
            onChange={(e) => setUnstakeAmount(e.target.value)} 
            placeholder="Unstake amount in SUI" 
          />
          <button onClick={unstake}>Unstake</button>
        </div>

      {
      /*currentAccount ? */
    //   (
    //   ) 
    //   : (
    //     <button onClick={() => document.getElementById('connectBtn').click()}>Connect Wallet</button>
    //   )
      }

      {/* Wallet connect button hidden but clickable */}
      {/* <button id="connectBtn" style={{ display: 'none' }}></button> */}
    </div>
  );
}

export default Staking;