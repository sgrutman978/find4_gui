import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { newMultiPlayerGameTx, fetchEvents, myNetwork, newSinglePlayerGameTx, /*fetchProfile*/ } from './sui_controller';
// import { ExtendedProfile } from './GameBoard';
 
 function NewGameButton(props: any) {
	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	const [digest, setDigest] = useState('');
	const currentAccount = useCurrentAccount();
  	const [player2Addy, setPlayer2Addy] = useState('');

  const handleChange = (val: React.ChangeEvent<HTMLInputElement>) => {
    setPlayer2Addy(val.target.value);
  };

  let intervalId: string | number | NodeJS.Timeout | undefined = undefined;

  const sendTransaction = async () => {
	if (!currentAccount){
		alert("Please connect a SUI wallet");
	} else {
		let transaction = props.gameType == "single" ? await newSinglePlayerGameTx() : await newMultiPlayerGameTx(currentAccount.address, props.trophies);
		signAndExecuteTransaction({
			transaction: transaction,
			chain: `sui:${myNetwork}`,
		}, {
			onSuccess: (result) => {
				console.log('executed transaction', result);
				if(intervalId){
					clearInterval(intervalId);
				}
				intervalId = setInterval(() => {
					getGameCreationEvents();
					console.log('Interval running...'+props.currentAddy);
				  }, 1000);
				
			},
			onError: (e) => {
				console.log(e);
			}
		});	
	}
  }				

	// return () => clearInterval(intervalId); // Cleanup on state change or unmount
  const getGameCreationEvents = () => {
	  fetchEvents().then((events) => {
		  events?.forEach((event) => {
			  if(event.type == process.env.REACT_APP_ORIGINAL_ADDRESS_FOR_EVENT_AND_OBJECT_TYPE+"::multi_player::PairingEvent" || event.type == process.env.REACT_APP_ORIGINAL_ADDRESS_FOR_EVENT_AND_OBJECT_TYPE+"::single_player::SinglePlayerGameStartedEvent"){
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

	return (
	<>
		<button className="newGameButton" onClick={() => sendTransaction()} disabled={props.disabled}>{props.label}</button>
	</>
	);
}

export default NewGameButton;
