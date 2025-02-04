import React, { useState, useEffect } from 'react';
import { getFullnodeUrl, SuiClient, SuiClientOptions } from '@mysten/sui/client';
// import { useWalletKit } from '@mysten/wallet-kit';
import { coinWithBalance, Transaction } from '@mysten/sui/transactions';
import { ConnectButton, SuiClientProvider, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { initVersion, myNetwork, OGAddyForEventObjType, programAddress, treasuryAddy, stakingPoolAddy, stakingPoolVersion, getSpecificSuiObject, suiClient } from './sui_controller';
import { Button, LinearProgress, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const networks = {
	testnet: { url: getFullnodeUrl('testnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
  } satisfies Record<string, SuiClientOptions>;

function Staking() {

	const [activeNetwork, setActiveNetwork] = useState("mainnet" as keyof typeof networks);

  const OneCoinNineDecimals = 1000000000;

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [message, setMessage] = useState('');
  const [staked, setStaked] = useState(null);
  const [currentEpoch, setCurrentEpoch] = useState(0);
    const [suiBalance, setSuiBalance] = useState("");
    const [ffioBalance, setFfioBalance] = useState("");
  const client = new SuiClient({ url: getFullnodeUrl('devnet') }); // Use 'testnet' or 'mainnet' as needed

  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  useEffect(() => {
    calculateRewards();
  }, []);

  const calculateRewards = () => {
    // console.log(staked);
    // if(staked){
      // setRewards((staked as any).reward_rate*(getCurrentEpochSeconds() - parseInt((staked as any).start_epoch))*((staked as any).amount)/OneCoinNineDecimals);
    // }
    setCurrentEpoch(getCurrentEpochSeconds());
    setTimeout(() => {calculateRewards()}, 2000);
  };

  useEffect(() => {
    if (!currentAccount) {
      setMessage('Please connect your wallet');
    } else {
      setMessage('Wallet connected');
    }
  }, [currentAccount]);

  useEffect(() => {
    if(currentAccount){
      getBalances();
      getSpecificSuiObject(currentAccount?.address!, "0x4ea810be83c0fb428ee1283312cbff4aea6dc266f6db932ca9a47cae9dcb9d29::FFIO::StakeObject").then(data => {
        console.log(data);
        if(data && data.length > 0){
          setStaked((data[0] as any).data.content.fields);
        }else{
          setStaked(null);
        }
        // console.log(staked);
        // setRewards((staked as any).reward_rate*(getCurrentEpochSeconds() - parseInt((staked as any).start_epoch))*((staked as any).amount)/OneCoinNineDecimals);
      })
    }
  }, [message, currentAccount]);

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

  const existing = async () => {
    if (!currentAccount) {
      setMessage('Wallet not connected');
      return;
    }
    const tx = new Transaction();
    // const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(Number(stakeAmount) * 1e9)]); // Convert to MIST
    tx.setSender(currentAccount.address);
    tx.moveCall({
      target: `${programAddress}::FFIO::stake_existing_ffio`,
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
        tx.object("0x6"),
        tx.object((staked!as any).id.id)
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
        tx.object((staked as any).id.id),
        tx.object("0x6")
      ], 
    });

    doTransaction(tx);
  }

  const collect = async () => {
    if (!currentAccount) {
      setMessage('Wallet not connected');
      return;
    }
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${programAddress}::FFIO::claim_rewards2`,
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
        tx.object((staked as any).id.id),
        tx.object("0x6")
      ], 
    });

    doTransaction(tx);
  }

  const stakeOrExisting = () => {
    console.log("staked");
    console.log(staked);
    if(!staked){
      stake();
      console.log("lll1");
    }else{
      existing();
      console.log("lll2");
    }
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
      coinWithBalance({type: "0xd9fc80a30c89489764bc07f557dc17162a477d34a9b44e65aae48af8ead006e7::FFIO::FFIO", balance: 39*10000*OneCoinNineDecimals}), // Using gas as the payment, this is just for example. Adjust accordingly.
      tx.makeMoveVec({type: "address", elements: [
        tx.pure.address("0x128e1fe059f387d5d2a1d0757baa9e6c86b4c5351e60774be65bd188dcb71845"),
        tx.pure.address("0xcc03ece66e2f3a1f3ca9c92e5268d53508d8c4d997b0d221cab3525fd8077ff6"),
        tx.pure.address("0xdaede247a15d880806d03bce90f4d6ad121cabeb1148e504218033c0e1789e8d"),
        tx.pure.address("0xac259ac799d26dd54572c03f4d0376e8465a827d87d63afda2eb515052d73778"),
        tx.pure.address("0x4f27629642f7cfe2c7645bc11a4458139f0687743ef082802a37fd0d8edaa9c3"),
        tx.pure.address("0x3fab24a565575a4c1b3f47e7d6998d92df6b1c4fa28b0ff6aa32142ec494e446"),
        // tx.pure.address(""),
      ]}),
      tx.pure.u64(10000*OneCoinNineDecimals),
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

  function getCurrentEpochSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }

    async function getBalances(){
      if(currentAccount){
        suiClient.getBalance({ owner: currentAccount?.address! }).then((res) => {
          console.log(res.totalBalance);
          const b = Math.floor((parseInt(res.totalBalance)/OneCoinNineDecimals)*10000)/10000;
          setSuiBalance(b+"");
          console.log(suiBalance);
        });
        suiClient.getBalance({ owner: currentAccount?.address!, coinType: `${OGAddyForEventObjType}::FFIO::FFIO` }).then((res) => {
          console.log(res.totalBalance);
          const b = Math.floor((parseInt(res.totalBalance)/OneCoinNineDecimals)*10000)/10000;
          setFfioBalance(b+"");
          console.log(suiBalance);
        });
      }
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
  <div className="presale-container" style={{width:700, margin: "auto", top: 120}} id="presale">
  <div className="connectButtonWrapper2">
    <div className="right topRight"> 
    {currentAccount ? <>Wallet: <span style={{marginRight: 7, marginLeft: 5}}>
              <img style={{width: 18, marginRight: 2, top: 2, position: "relative"}} src="./sui-logo.png" />
              <span style={{fontSize: 18}}>{suiBalance}</span>
            </span> 
            <span style={{marginRight: 12}}>
              <img style={{width: 18, marginRight: 3, top: 3, position: "relative", borderRadius: 9}} src="./f4-42.png" />
              <span style={{fontSize: 18}}>{ffioBalance}</span>
            </span></> 
            : <></>}
      <ConnectButton></ConnectButton>
    </div>
    {/* {autoConnectionStatus} */}
  </div>
  <div className="presale-title" style={{marginTop: 68, marginBottom: 15}}><img src="./f4-42.png" style={{width: 42, position: "relative", top:5, borderRadius: 21, marginRight: 5}} />FFIO Staking</div>
  {/* <div className="presalePanelsContainer"> */}




    <div className="presalePanel">
      {/* <span><span className="left">Progress</span><span className="right">{presaleState.tokens_sold * 100 / presaleState.cap}%</span></span> */}
      {/* <LinearProgress variant="determinate" className="progressBar" value={progress} /> */}
      <span>
      <span className="left">FFIO Staked: {staked ? (staked as any).amount/OneCoinNineDecimals : "0"} FFIO</span><br />
      <span className="left">Current Rewards: {staked ? ((staked as any).reward_rate*(currentEpoch - parseInt((staked as any).start_epoch))*((staked as any).amount)/OneCoinNineDecimals)/OneCoinNineDecimals : "0"} FFIO</span>
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

          <TextField 
            type="number" 
            value={stakeAmount} 
            onChange={(e) => setStakeAmount(e.target.value)} 
            placeholder="Stake amount in SUI" 
          />
          <Button onClick={stakeOrExisting}>{staked && (staked as any).amount != 0? "Stake More" : "Stake"}</Button>
          {staked && (staked as any).amount != 0 ? <Button onClick={unstake}>Unstake All</Button> : ""}
          {staked && (staked as any).amount != 0 ? <Button onClick={collect}>Collect Rewards</Button> : ""}
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