import React, { useState, useEffect } from 'react';
import { getFullnodeUrl, SuiClient, SuiClientOptions } from '@mysten/sui/client';
// import { useWalletKit } from '@mysten/wallet-kit';
import { coinWithBalance, Transaction } from '@mysten/sui/transactions';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import DoTransaction, { initVersion, myNetwork, OGAddyForEventObjType, programAddress, treasuryAddy, stakingPoolAddy, stakingPoolVersion, getSpecificSuiObject, suiClient } from './sui_controller';
import { Button, LinearProgress, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEnokiFlow } from '@mysten/enoki/react';
import GameSuiteClient from './sui_controller';


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
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const gsl = new GameSuiteClient(useEnokiFlow(), useCurrentAccount(), signAndExecuteTransaction);

  // const doTx = DoTransaction();

      // const enokiFlow = useEnokiFlow();
      // const [myAddy, setMyAddy] = useState<string>();
      // useEffect(() => {
      //   enokiFlow.$zkLoginState.subscribe((state) => {
      //     setMyAddy(state?.address!);
      //   });
      // }, [enokiFlow.$zkLoginState]);

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
    if (!gsl.myAddy) {
      setMessage('Please connect your wallet');
    } else {
      setMessage('Wallet connected');
    }
  }, [gsl.myAddy]);

  useEffect(() => {
    if(gsl.myAddy){
      getBalances();
      getSpecificSuiObject(gsl.myAddy, "0x4ea810be83c0fb428ee1283312cbff4aea6dc266f6db932ca9a47cae9dcb9d29::FFIO::StakeObject").then(data => {
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
  }, [message, gsl.myAddy]);

  const stake = async () => {
    if (!gsl.myAddy) {
      setMessage('Wallet not connected');
      return;
    }
    const tx = new Transaction();
    // const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(Number(stakeAmount) * 1e9)]); // Convert to MIST
    tx.setSender(gsl.myAddy);
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

    doMyTransaction(tx);
  }

  const existing = async () => {
    if (!gsl.myAddy) {
      setMessage('Wallet not connected');
      return;
    }
    const tx = new Transaction();
    // const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(Number(stakeAmount) * 1e9)]); // Convert to MIST
    tx.setSender(gsl.myAddy);
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

    doMyTransaction(tx);
  }

  const unstake = async () => {
    if (!gsl.myAddy) {
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

    doMyTransaction(tx);
  }

  const collect = async () => {
    if (!gsl.myAddy) {
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

    doMyTransaction(tx);
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

  const doMyTransaction = (tx: Transaction) => {
    gsl.doTransaction(tx, (result: any) => {
      setMessage('Staking transaction sent: ' + result.digest);
          if (result.digest) {
            alert('Transaction successful!');
            // fetchPresaleState();
          }
    }, (error) => {
      setMessage('Error in staking: ' + error.message);
    });
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
        tx.pure.address("0xd587502148642deff8b1417a8b4b6d06c930ce0666437e3225ffcbc17105e8e5"),
        tx.pure.address("0xcd78445bdc2f57ce7b1ce1b8daf91570ecea2ff6538e8158f3a0fee7a1a204cd"),
        tx.pure.address("0x9f4856a47b65977629cb87db890f8b8d79ffd04153c1aba9d2432243f1c46cb5"),
        tx.pure.address("0xc7125b4e96ea9a3d4eeedd7e2394fe3f50f5e15768515a2b6b2e9dd11844a341"),
        tx.pure.address("0xa916536784b9ae4fe10f1c394e494fe4b9c931bcddc654c18ace1f8be54272cc"),
        tx.pure.address("0x0a2bbe62c1b6b4a40c511151aeaa8d30e0a2e67992486ae8291767ec8508ace3"),
        tx.pure.address("0x032dc2ed4902d208a0fce095a0ab0496626fd126b0e9781b3e957cc2e03b558f"),
        tx.pure.address("0xad7d347918d6f563d4f276b38595738ff4b97d6898d520fbe9803f605b699844"),
        tx.pure.address("0x0996bc56260e6fc94bdbfb0e55fb03eebbff806c2bb20b7baefb942896c10f3b"),
        tx.pure.address("0xdf1aa47370e7cd89dc3c78d3850a4bf6f0b266659867b961837aa2ce4248377b"),
        tx.pure.address("0x3455a113f912d51f8e5e5f9d45a0a72424e1c46b795a5e6cb2855b47a9aa9791"),
        tx.pure.address("0xd91227b76319b9831f386cb5ef55f49a07109d977c148742fd74d19f29aeb730"),
        tx.pure.address("0xb4fde19cc9e156e1102a918efe8eb499c4f96331dd69747b4ec472fee83a83b0"),
        tx.pure.address("0x5b474793b0a6c48177244ebb4995465b7b3affbf4a5408a2590535b69ba46256"),
        tx.pure.address("0x6026264b01749f1776ec662c178b66830bb68adc4f8dd49d04fc7fb3e711110d"),
        tx.pure.address("0x428eacc8fbd1b9926a639c34b3fe2d920d2a500f6053d5a6136b1aab5cf6c0a8"),
        tx.pure.address("0x9874e8f96090a0ab3e03f59126948274744354e4c8f3990853a132ec0534de49"),
        tx.pure.address("0x8ca5ef3165b259a3abe339eeeae4bbd24cab1a08bb83bff2dea7060d5f5959b1"),
        tx.pure.address("0x3c27f11953dbb23b3ccfc343d08f2ab37b2d76a3a46371c0d3e6729fa45a417d"),
        tx.pure.address("0x76e7c841779e997c8eeeb204164f943749b08b52fe6cd3e71b95974f8b7b57d0"),
        tx.pure.address("0xe8dc636106e44496b2bef72b7ce8a20af9d75f0ffe9a2ec29154b7973edb3873"),
        tx.pure.address("0xe05606b61f070399b9cd583db9f75a3c358812c585479a5c69cd9ff2aba91deb"),
        tx.pure.address("0x2628cf722fbf837c06cdfab9c00ef546c5c0da1f15d4ae6a0205ac7d7aa3a38e"),
        tx.pure.address("0x54e406606f1a1807f3dc256c1e0c55fe617de0ce08d92f139b4f90574ad5081a"),
        tx.pure.address("0x69d006fa84b998a6caae9465c063d337c727c10af25df221074914f6ccae15da"),
        tx.pure.address("0x158e35308dcb833ec0a3d96e73efc55a74a5c40bf311fad79217bb2a0fbc279b"),
        tx.pure.address("0x19bc693734bbc83819bb25223ce522555c7e2978140c25faeb482e60f3a84d24"),
        tx.pure.address("0x20747f6ddb2d402ea739cf3fe3b48f2a3ed1dd3c1b64946da576d969bfe2beed"),
        tx.pure.address("0xf65329f3a3668c2011a346892bb8b37380e5bf2a30a3c0fcb64158ddd84bb65f"),
        tx.pure.address("0x99a970b49dfa450799dc571518b9c2476842545e4337cc0ef71218c528cca095"),
        tx.pure.address("0xd5f60863c4b626485c38baccba213fd508e769c78b9c27b21a1e1515f7074209"),
        // tx.pure.address(""),
      ]}),
      tx.pure.u64(10000*OneCoinNineDecimals),
      ],
    });
    gsl.doTransaction(tx, (result: any) => {
      if (result.digest) {
        alert('Distribution successful!');
      }
    });
  }

  function getCurrentEpochSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }

    async function getBalances(){
      if(gsl.myAddy){
        suiClient.getBalance({ owner: gsl.myAddy }).then((res) => {
          console.log(res.totalBalance);
          const b = Math.floor((parseInt(res.totalBalance)/OneCoinNineDecimals)*10000)/10000;
          setSuiBalance(b+"");
          console.log(suiBalance);
        });
        suiClient.getBalance({ owner: gsl.myAddy, coinType: `${OGAddyForEventObjType}::FFIO::FFIO` }).then((res) => {
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
  <div className="presale-container" style={{width:700, margin: "auto"}} id="presale">
  <div className="connectButtonWrapper2">
    <div className="right topRight"> 
    {gsl.myAddy ? <>Wallet: <span style={{marginRight: 7, marginLeft: 5}}>
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

       {/* <button onClick={() => massDistributeHelper()}>Distribute</button> */}

    </div>
    // </div>
    // </SuiClientProvider>
  );
}

export default Staking;