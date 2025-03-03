import React, { useState, useEffect } from 'react';
import { CoinStruct, SuiClient, SuiClientOptions, getFullnodeUrl } from '@mysten/sui/client';
import { coinWithBalance, Transaction } from '@mysten/sui/transactions';
import { fromB64 } from '@mysten/bcs';
import DoTransaction, { GetObjectContents, OGAddyForEventObjType, presaleStateMainnet, programAddress, suiClient_Mainnet } from './sui_controller';
import { ConnectButton, SuiClientProvider, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';

import TextField from '@mui/material/TextField';

import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEquals, faExchange } from '@fortawesome/free-solid-svg-icons';
import { useEnokiFlow } from '@mysten/enoki/react';
import ProfileButtonAndPanel from './ProfileButtonAndPanel';
import GameSuiteClient from './sui_controller';

const OneCoinNineDecimals = 1000000000;

function Presale() {
  const [presaleState, setPresaleState] = useState<any>({});
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState("");
  const [suiBalance, setSuiBalance] = useState("");
  const [ffioBalance, setFfioBalance] = useState("");

    const enokiFlow = useEnokiFlow();
    // const [myAddy, setMyAddy] = useState("");
    // useEffect(() => {
    //     enokiFlow.getKeypair().then((pair) => {
    //         setMyAddy(pair.toSuiAddress());
    //     });
    // }, [enokiFlow]);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const gsl = new GameSuiteClient(useEnokiFlow(), useCurrentAccount(), signAndExecuteTransaction);

  const [progress, setProgress] = React.useState(0);

  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
  //   }, 800);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);


  useEffect(() => {
    fetchPresaleState();
  }, []);

  useEffect(() => {
    getBalances();
  }, [enokiFlow]);

  async function fetchPresaleState() {
    GetObjectContents(presaleStateMainnet!).then((obj) => {
      setPresaleState(obj.data);
      setProgress((obj.data.tokens_sold / obj.data.cap)*100)
    });
  }

  async function getBalances(){
    if(enokiFlow){
      suiClient_Mainnet.getBalance({ owner: gsl.myAddy }).then((res) => {
        console.log(res.totalBalance);
        const b = Math.floor((parseInt(res.totalBalance)/OneCoinNineDecimals)*10000)/10000;
        setSuiBalance(b+"");
        console.log(suiBalance);
      });
      suiClient_Mainnet.getBalance({ owner: gsl.myAddy, coinType: `${OGAddyForEventObjType}::FFIO::FFIO` }).then((res) => {
        console.log(res.totalBalance);
        const b = Math.floor((parseInt(res.totalBalance)/OneCoinNineDecimals)*10000)/10000;
        setFfioBalance(b+"");
        console.log(suiBalance);
      });
    }
  }

  async function buyTokens() {
    try {
      const tx = new Transaction();
      // const userCoins = await suiClient_Mainnet.getCoins({ owner: currentAccount?.address!, coinType: '0x2::sui::SUI' });

      // if(userCoins.data.length > 0){
        // const coinToUse: CoinStruct = userCoins.data[0];
        // userCoins.data.map((coin, i) => {
        //   if(i != 0){
        //     // console.log()
        //     tx.mergeCoins()
        //   }
        // });
        // const destinationCoin = userCoins.data[0].coinObjectId;
    
        // Merge the rest of the coins into the destination coin
        // const coinsToMerge = userCoins.data.slice(1).map(coin => coin.coinObjectId);
        // console.log(coinsToMerge);
        // const [coin] = tx.mergeCoins(tx.object(destinationCoin), [tx.object(userCoins.data[1].coinObjectId)]);
        // console.log(y);
      // }
      // const coinToUse = userCoins.data[0].coinObjectId; // or combine multiple coins
      
      // Split coins if needed, here we're splitting 100 MIST (0.01 SUI)
      // const [coin2] = tx.splitCoins(tx.object(coin), [amount*presaleState.price]); //tx.object(userCoins.data[0].coinObjectId

      tx.setSender(gsl.myAddy);
      // Assuming you have the address of the package where your Move module is published
      tx.moveCall({
        target: `${programAddress}::FFIO::buy_token`,
        arguments: [
          tx.object(presaleStateMainnet!), // Replace with actual object ID
          coinWithBalance({balance: amount*presaleState.price}), // Using gas as the payment, this is just for example. Adjust accordingly.
          tx.pure.u64(amount),
        ],
      });
      
      gsl.doTransaction(tx, (result) => {
        if (result.digest) {
          alert('Transaction successful!');
          fetchPresaleState();
          getBalances();
        }
      });
      
      
    } catch (err) {
      setError("Failed to buy tokens: " + err);
    }
  }

  if (!presaleState) return <div>Loading...</div>;
  console.log(presaleState);

  return (
      <div className="presale-container">
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
            <ProfileButtonAndPanel />
          </div>
          {/* {autoConnectionStatus} */}
        </div>
        <div className="presale-title" style={{marginTop: 18, marginBottom: 15}}><img src="./f4-42.png" style={{width: 42, position: "relative", top:5, borderRadius: 21, marginRight: 5}} />FFIO Presale (Mainnet)</div>
        {/* <div className="presalePanelsContainer"> */}




          <div className="presalePanel">
            <span><span className="left">Progress</span><span className="right">{presaleState.tokens_sold * 100 / presaleState.cap}%</span></span>
            <LinearProgress variant="determinate" className="progressBar" value={progress} />
            <span>
            <span className="left">FFIO Sold: {presaleState.tokens_sold / OneCoinNineDecimals}</span>
            <span className="right">Presale Supply: 2B FFIO</span>
            </span>

            <div style={{marginBottom: -3, marginTop: 24}}>
            <span className="suiBalance">
              <img style={{width: 18, marginRight: 5, top: 3, position: "relative", borderRadius: 9}} src="./f4-42.png" />
              <span style={{fontSize: 18, marginRight: 5}}>1 FFIO</span>
          </span> 
            <FontAwesomeIcon icon={faEquals} />
            <span className="suiBalance" style={{marginRight: 5, marginLeft: 5}}>
              <img style={{width: 18, marginRight: 2, top: 2, position: "relative"}} src="./sui-logo.png" />
              <span style={{fontSize: 18}}>{presaleState.price/OneCoinNineDecimals} SUI</span>
            </span> 
          </div>

            </div>
          {/* <div className="presalePanel orange"> */}
            {/* <CircularProgress /> */}
            {/* <CircularProgress style={{width:100}} variant="determinate" value={progress} /> */}

            {/* <br /> */}

            {/* <LinearProgress /> */}
            



            <TextField 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(parseInt(e.target.value, 10))} 
              label="FFIO to buy"
              className="tokenInput"
            />
            <TextField 
              type="number" 
              value={(amount*(presaleState.price))/OneCoinNineDecimals} 
              // onChange={(e) => setAmount(parseInt(e.target.value, 10))} 
              label="Cost in SUI"
              className="tokenInput" disabled
            />

            {/* <TextField id="standard-basic" label="Standard" variant="standard" /> */}
            <Button variant="contained" onClick={buyTokens} className="buyTokensButton">Buy FFIO</Button>
            {/* <button onClick={buyTokens} className="buyTokensButton">Buy Tokens</button> */}

            {error && <p style={{color: 'red'}}>{error}</p>}
          {/* </div> */}
        {/* </div> */}
      </div>
  );
}

export default Presale;