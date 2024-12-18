import React, { useState, useEffect } from 'react';
import { getFullnodeUrl, SuiClient, SuiClientOptions } from '@mysten/sui/client';
// import { useWalletKit } from '@mysten/wallet-kit';
import { coinWithBalance, Transaction } from '@mysten/sui/transactions';
import { ConnectButton, SuiClientProvider, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { myNetwork } from './sui_controller';

const networks = {
	testnet: { url: getFullnodeUrl('testnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
  } satisfies Record<string, SuiClientOptions>;

function Staking() {

	const [activeNetwork, setActiveNetwork] = useState("mainnet" as keyof typeof networks);

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

  function massDistributeHelper(){
    const tx = new Transaction();
    tx.setSender("0x8418bb05799666b73c4645aa15e4d1ccae824e1487c01a665f51767826d192b7");
    // Assuming you have the address of the package where your Move module is published
    tx.moveCall({
      target: `0xf81b0ecbb102682888971828b4cab3512aca54d1623e8586d0376547e4c9c66c::FFIO::distribute_tokens4`,
      arguments: [
      coinWithBalance({type: "0xd9fc80a30c89489764bc07f557dc17162a477d34a9b44e65aae48af8ead006e7::FFIO::FFIO", balance: 19*1000*1000000000}), // Using gas as the payment, this is just for example. Adjust accordingly.
      tx.makeMoveVec({type: "address", elements: [
        tx.pure.address("0xb8e8342b6015593951dbde508fb6ad58f3ef9f1a4f556c35c9baaac2fded5b28"),
        tx.pure.address("0x2ba3e6b9debcc3a906dc390ae1eb2de1e477c7e40793cf9431b86e69bc1413d1"),
      ]}),
      tx.pure.u64(1000*1000000000),
      ],
    });
    signAndExecuteTransaction({
      transaction: tx,
      chain: `sui:mainnet`,
    }, {
      onSuccess: (result) => {
      console.log('executed transaction', result);
      if (result.digest) {
        alert('Distribution successful!');
      }
      },
      onError: (error) => {
      console.log(error);
    }
    },);
  }

  return (
  //   <SuiClientProvider
  //   networks={networks}
  //   network={activeNetwork}
  //   onNetworkChange={(network) => {
  //     setActiveNetwork(network as keyof typeof networks);
  //   }}
  //   // defaultNetwork="devnet"
  //   createClient={(network, config) => {
  //     return new SuiClient({ url: getFullnodeUrl(network) });
  //   }}
  // >
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
       <button onClick={() => massDistributeHelper()}>Distribute</button>
    </div>
    // </SuiClientProvider>
  );
}

export default Staking;