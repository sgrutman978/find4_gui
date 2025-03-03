import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import DoTransaction, { newMultiPlayerGameTx, fetchEvents, myNetwork, newSinglePlayerGameTx, OGAddyForEventObjType, programAddress, /*fetchProfile*/ } from './sui_controller';
import { CircularProgress, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faHome, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import { getP2 } from './ServerConn';
import { useEnokiFlow } from '@mysten/enoki/react';
import GameSuiteClient from './sui_controller';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
// import { ExtendedProfile } from './GameBoard';
 
 function NewGameButton(props: any) {
	const [loading, setLoading] = useState(false);
	const [addyInput, setAddyInput] = useState("");
	const [addyPasses, setAddyPasses] = useState(true);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const gsl = new GameSuiteClient(useEnokiFlow(), useCurrentAccount(), signAndExecuteTransaction);

  let intervalId: string | number | NodeJS.Timeout | undefined = undefined;

  const sendTransaction = async () => {
	if (!gsl.myAddy){
		alert("Please connect a SUI wallet");
	} else {
		if(props.gameType != "challenge" || checkAddyInput(addyInput)){
			console.log("lslslslsl");
			getP2(gsl.myAddy).then(async (p2) => {
				console.log(p2);
			let transaction = props.gameType == "single" ? await newSinglePlayerGameTx(props.trophies) : await newMultiPlayerGameTx((checkAddyInput(addyInput) ? addyInput : p2), props.trophies);
				if(transaction){
					transaction!.setSender(gsl.myAddy);
					gsl.doTransaction(transaction, () => {
						setLoading(() => true);
							if(intervalId){
								clearInterval(intervalId);
							}
							intervalId = setInterval(() => {
								getGameCreationEvents();
								// console.log('Interval running...'+currentAccount.address);
							}, 1000);
					});
				}
			});
		}else{
			if(!checkAddyInput(addyInput)){
				setAddyPasses(false);
			}
		}
	}
  }				

	// return () => clearInterval(intervalId); // Cleanup on state change or unmount
  const getGameCreationEvents = () => {
	  fetchEvents().then((events) => {
		console.log("\n\n\n\n\n\n\ngwsgsfgsdfgsdfgd");
		console.log(events![0]);
		  events?.reverse().forEach((event) => {
			console.log(event);
			  if(event.type == "0xb31882ffecd729c1dcd7e1884ba9bee60ca4756a87795b46c498de85b0cdfd06::multi_player::MultiPlayerGameStartedEvent2" || event.type == OGAddyForEventObjType+"::single_player::SinglePlayerGameStartedEvent"){
				console.log("ppppppppp");  
				let eventData = event.parsedJson as any;
				  let x = (Date.now() - Number(event.timestampMs)) < 15000;
				  console.log(Date.now());
				  console.log(Number(event.timestampMs));
				  console.log((Date.now() - Number(event.timestampMs)));
				  console.log(x);
				  console.log(eventData.p1);
				  if (x && (eventData.p1 == gsl.myAddy || eventData.p2 == gsl.myAddy)){
					  //redirect to game page the event described
					  window.location.href = '/app/game/'+eventData.game;
				  }
		  }
		  });
	  });
  };

	const changeAddyInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAddyInput(event.target.value);
		console.log(addyInput);
		checkAddyInput(event.target.value);
	}

	const checkAddyInput = (txt: string) => {
		const suiAddressRegex = /^0x[a-fA-F0-9]{64}$/;
		let passes = suiAddressRegex.test(txt);
		console.log(passes);
		console.log("chaaaaaaaaaaange");
		setAddyPasses(passes || txt == "");
		return passes;
	}

//   console.log(loading);

	return (
	<>
		<button className="newGameButton" onClick={() => sendTransaction()} disabled={props.disabled} style={{marginRight: (props.label == "Challenge" ? "0vw" : "0vw")}}>
		{<FontAwesomeIcon icon={(props.label == "Multiplayer" ? faDice : (props.label == "Challenge" ? faUser : faRobot))} style={{margin: "auto", marginBottom: 6}} />}
			{/* <img src={
			props.label == "Multiplayer" ? "../../ai.webp" : "../../ai.webp"
			} className="newGameImage" /> */}
			<span style={{width: "100%", fontSize: "2.5vw"}}>{props.label == "Multiplayer" ? "Vs." : (props.label == "Singleplayer" ? "Bot" : "1v1")}</span></button>
			{props.label == "Challenge" ? <TextField label="1v1 Opponent Sui Address" 
			style={{width: "20vw", top: "4vw", fontSize: "180px"}}
			sx={{
				'& .MuiOutlinedInput-root': {
				  '& fieldset': {
					borderColor: (addyPasses ? "black" : "red"), // Change the color here
				  },
				  '&:hover fieldset': {
					borderColor: (addyPasses ? "black" : "red"), // Change the hover color here
				  },
				  '&.Mui-focused fieldset': {
					borderColor: (addyPasses ? "black" : "red"), // Change the focused color here
				  },
				},
			  }}
			   variant="outlined" fullWidth onChange={changeAddyInput}/> : ""}
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
