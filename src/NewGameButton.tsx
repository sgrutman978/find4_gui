import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { newMultiPlayerGameTx, fetchEvents, myNetwork, newSinglePlayerGameTx, OGAddyForEventObjType, programAddress, /*fetchProfile*/ } from './sui_controller';
import { CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import { getP2 } from './ServerConn';
// import { ExtendedProfile } from './GameBoard';
 
 function NewGameButton(props: any) {
	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	const [digest, setDigest] = useState('');
	const currentAccount = useCurrentAccount();
  	const [player2Addy, setPlayer2Addy] = useState('');
	const [loading, setLoading] = useState(false);

  const handleChange = (val: React.ChangeEvent<HTMLInputElement>) => {
    setPlayer2Addy(val.target.value);
  };

  let intervalId: string | number | NodeJS.Timeout | undefined = undefined;

  const sendTransaction = async () => {
	if (!currentAccount){
		alert("Please connect a SUI wallet");
	} else {
		// console.log("lslslslsl");
		getP2(currentAccount.address).then(async (p2) => {
		let transaction = props.gameType == "single" ? await newSinglePlayerGameTx() : await newMultiPlayerGameTx(p2, props.trophies);
			if(transaction){
				signAndExecuteTransaction({
					transaction: transaction,
					chain: `sui:${myNetwork}`,
				}, {
					onSuccess: (result) => {
						console.log('executed transaction', result);
						setLoading(() => true);
						if(intervalId){
							clearInterval(intervalId);
						}
						intervalId = setInterval(() => {
							getGameCreationEvents();
							// console.log('Interval running...'+currentAccount.address);
						}, 1000);
						
					},
					onError: (e) => {
						console.log(e);
					}
				});	
			}
		});
	}
  }				

	// return () => clearInterval(intervalId); // Cleanup on state change or unmount
  const getGameCreationEvents = () => {
	  fetchEvents().then((events) => {
		  events?.forEach((event) => {
			  if(event.type == programAddress+"::multi_player::MultiPlayerGameStartedEvent2" || event.type == OGAddyForEventObjType+"::single_player::SinglePlayerGameStartedEvent"){
				  let eventData = event.parsedJson as any;
				  let x = (Date.now() - Number(event.timestampMs)) < 20000;
				  if (x && (eventData.p1 == currentAccount?.address || eventData.p2 == currentAccount?.address)){
					  //redirect to game page the event described
					  window.location.href = '/app/game/'+eventData.game;
				  }
		  }
		  });
	  });
  };
//   console.log(loading);
	return (
	<>
		<button className="newGameButton" onClick={() => sendTransaction()} disabled={props.disabled} style={{marginLeft: (props.label == "Multiplayer" ? "-1.5vw" : "1.5vw")}}>
		{props.label == "Multiplayer" ? <FontAwesomeIcon icon={faUser} style={{margin: "auto", marginBottom: 6}} /> : <FontAwesomeIcon icon={faRobot} style={{margin: "auto", marginBottom: 6}} />}
			{/* <img src={
			props.label == "Multiplayer" ? "../../ai.webp" : "../../ai.webp"
			} className="newGameImage" /> */}
			<span style={{width: "100%", fontSize: "2.5vw"}}>{props.label == "Multiplayer" ? "Random" : "AI"}</span></button>
		{loading ? <div className="loadingScreen">
			<a href="/app">
				<FontAwesomeIcon icon={faHome} className="yellowHome" />
			</a>
			{/* <div style={{backgroundColor: "pink"}}></div> */}
			{/* (During testing, there may not be another player online) */}
			<div style={{fontSize: 42, color: "yellow", fontFamily: '"Balsamiq Sans", sans-serif'}}>Loading Game...<br /><br />
			<CircularProgress style={{margin: "auto"}} />
			</div>
		</div> : <></>}
	</>
	);
}

export default NewGameButton;
