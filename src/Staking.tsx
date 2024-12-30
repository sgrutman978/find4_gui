import React, { useState, useEffect } from 'react';
import { getFullnodeUrl, SuiClient, SuiClientOptions } from '@mysten/sui/client';
// import { useWalletKit } from '@mysten/wallet-kit';
import { coinWithBalance, Transaction } from '@mysten/sui/transactions';
import { ConnectButton, SuiClientProvider, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { initVersion, myNetwork, OGAddyForEventObjType, programAddress, treasuryAddy, stakingPoolAddy, stakingPoolVersion } from './sui_controller';
import { LinearProgress, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    // const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(Number(stakeAmount) * 1e9)]); // Convert to MIST
    tx.setSender(currentAccount.address);
    tx.moveCall({
      target: `${programAddress}::FFIO::stake_new_ffio`,
      arguments: [
        tx.sharedObjectRef({
          objectId: stakingPoolAddy!,
          mutable: true,
          initialSharedVersion: stakingPoolVersion!
        }),
        coinWithBalance({type: `${OGAddyForEventObjType}::FFIO::FFIO`, balance: (Number(stakeAmount) * 1e9)}),
        tx.sharedObjectRef({
          objectId: treasuryAddy!,
          mutable: true,
          initialSharedVersion: initVersion!
        }),
        tx.object("0x6")
      ],
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
      target: `${programAddress}::FFIO::unstake_ffio`,
      arguments: [
        tx.sharedObjectRef({
          objectId: stakingPoolAddy!,
          mutable: true,
          initialSharedVersion: stakingPoolVersion!
        }),
        tx.sharedObjectRef({
          objectId: treasuryAddy!,
          mutable: true,
          initialSharedVersion: initVersion!
        }),
        tx.object("0xd11c802a99901bf931eb5cc3fde4b25f7d4bcb7634651d2144c4fee0000de715"),
        tx.object("0x6")
      ], 
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
        tx.pure.address("0xc57b21031d881ffa75ac39e6e92e2cc19505f30068c408e96c8717d2c0c08685"),
        tx.pure.address("0xc57b21031d881ffa75ac39e6e92e2cc19505f30068c408e96c8717d2c0c08685"),
        // tx.pure.address(""),
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
  <div className="presale-container">
  <div className="connectButtonWrapper2">
    <div className="right topRight"> 
    {currentAccount ? <>Wallet: <span style={{marginRight: 7, marginLeft: 5}}>
        <img style={{width: 18, marginRight: 2, top: 2, position: "relative"}} src="./sui-logo.png" />
        {/* <span style={{fontSize: 18}}>{suiBalance}</span> */}
      </span> 
      <span style={{marginRight: 12}}>
        <img style={{width: 18, marginRight: 3, top: 3, position: "relative", borderRadius: 9}} src="./f4-42.png" />
        {/* <span style={{fontSize: 18}}>{ffioBalance}</span> */}
      </span></> 
      : <></>}
      <ConnectButton></ConnectButton>
    </div>
    {/* {autoConnectionStatus} */}
  </div>
  <div className="presale-title" style={{marginTop: 18, marginBottom: 15}}><img src="./f4-42.png" style={{width: 42, position: "relative", top:5, borderRadius: 21, marginRight: 5}} />FFIO Staking (Mainnet)</div>
  {/* <div className="presalePanelsContainer"> */}




    <div className="presalePanel">
      {/* <span><span className="left">Progress</span><span className="right">{presaleState.tokens_sold * 100 / presaleState.cap}%</span></span> */}
      {/* <LinearProgress variant="determinate" className="progressBar" value={progress} /> */}
      <span>
      <span className="left">FFIO Staked: xyz</span>
      {/* <span className="right">Presale Supply: 2B FFIO</span> */}
      </span>

      {/* <TextField 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(parseInt(e.target.value, 10))} 
        label="FFIO to buy"
        className="tokenInput"
      /> */}

      <p>{message}</p>

          <input 
            type="number" 
            value={stakeAmount} 
            onChange={(e) => setStakeAmount(e.target.value)} 
            placeholder="Stake amount in SUI" 
          />
          <button onClick={stake}>Stake</button>
          <button onClick={unstake}>Unstake All</button>
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
    // </div>
    // </SuiClientProvider>
  );
}

export default Staking;