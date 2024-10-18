import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { suiClient, newGameTx, programAddress, fetchEvents } from './sui_controller';
import { getFullnodeUrl, SuiClient, SuiEvent, Unsubscribe } from '@mysten/sui/client';
// import { useNavigate } from 'react-router-dom';
// import { GetGameParticipationObjects, GetObjectContents, newGameTx } from './sui_controller';
// import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';
// import { checkIfMyTurn } from './GameBoard';
 
 function NewGameButton(props: any) {
	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	const [digest, setDigest] = useState('');
	const currentAccount = useCurrentAccount();
  	const [player2Addy, setPlayer2Addy] = useState('');

	//   const navigate = useNavigate();

//   const handleGameRedirect = (gameAddy: string) => {
//     navigate('/game/'+gameAddy); // Redirect to the /subpage route
//   };


  
  	// const [gameParticipates, setGameParticipation] = useState([{}]);
	// const p = GetGameParticipationObjects(currentAccount?.address!);
	// console.log(p);

	// const [events, setEvents] = useState([] as SuiEvent[]);

	// useEffect(() => {
		setInterval(() => {
			getGameCreationEvents();
		}, 1800);
	// }, []);

	
	

	const getGameCreationEvents = () => {
		fetchEvents().then((events) => {
			// setEvents(events!);
			events?.forEach((event) => {
				let eventData = event.parsedJson as any;
				let x = (Date.now() - Number(event.timestampMs)) < 2000;
				console.log(Number(event.timestampMs));
				console.log(x);
				if (x && (eventData.p1 == currentAccount?.address || eventData.p2 == currentAccount?.address)){
					//redirect to game page the event described
					// handleGameRedirect(eventData.game);
					window.location.href = '/game/'+eventData.game;
				}
			});
		});
	};

	// const Package = '<PACKAGE_ID>';

	// const MoveEventType = '<PACKAGE_ID>::<MODULE_NAME>::<METHOD_NAME>';
	
	// console.log(
	// 	await client.getObject({
	// 		id: Package,
	// 		options: { showPreviousTransaction: true },
	// 	}),
	// );

	// subscribeToEvents();

// 	const sub = async () => {
// 	let unsubscribe: Unsubscribe | undefined = await suiClient.subscribeEvent({
// 		filter: { MoveModule: {
// 			/** the module name */
// 			module: "find_four_game",
// 			/** the Move package ID */
// 			package: programAddress
			
// 		}},
// 		onMessage: (event) => {
// 			console.log('subscribeEvent', JSON.stringify(event, null, 2));
// 		},
// 	});
	
// 	process.on('SIGINT', async () => {
// 		console.log('Interrupted...');
// 		if (unsubscribe) {
// 			await unsubscribe();
// 			unsubscribe = undefined;
// 		}
// 	});
// }

// sub();

// 	useEffect(() => {
// 		async function doSub(){
// 			const client = new SuiClient({ url: getFullnodeUrl('devnet') });
// 	const Package = '0x0ab1df6b005fa2731b2d571aec358e3dbd1a9426410825ec217ecf03587587cb';
	
// 	const MoveEventType = '0x0ab1df6b005fa2731b2d571aec358e3dbd1a9426410825ec217ecf03587587cb::find_four_game::PairingEvent';

// 	let unsubscribe: Unsubscribe | undefined = await client.subscribeEvent({
// 		filter: { MoveEventType },
// 		onMessage: (event: any) => {
// 			console.log('subscribeEvent', JSON.stringify(event, null, 2));
// 		},
// 	});
	
// 	process.on('SIGINT', async () => {
// 		console.log('Interrupted...');
// 		if (unsubscribe) {
// 			await unsubscribe();
// 			unsubscribe = undefined;
// 		}
// 	});

// }
// doSub();
// }, []);
	// useEffect(() => {
	// 	// Initialize the SUI client with a connection to the Devnet
	// 	const provider = new JsonRpcProvider(devnetConnection);
	
	// 	// Define the event filter to listen for events emitted by the PairingEvent struct in your module
	// 	const filter = {
	// 	  MoveEventType: `0x<your_package_address>::${MODULE_NAME}::${EVENT_STRUCT_NAME}`,
	// 	};
	
	// 	// Function to handle incoming events
	// 	const handleEvent = (event: SuiEvent) => {
	// 	  console.log('New pairing event:', event);
	// 	  setEvents((prevEvents) => [...prevEvents, event]);
	// 	};
	
	// 	// Subscribe to events using the filter
	// 	const subscribeToEvents = async () => {
	// 	  const subscription = await provider.subscribeEvent(filter, handleEvent);
	
	// 	  // Cleanup function to unsubscribe when the component is unmounted
	// 	  return () => {
	// 		provider.unsubscribeEvent(subscription);
	// 	  };
	// 	};
	
	// 	// Start subscription
	// 	const unsubscribe = subscribeToEvents();
	
	// 	// Cleanup on component unmount
	// 	return () => {
	// 	  unsubscribe.then((unsubFn) => unsubFn());
	// 	};
	//   }, []);




  const handleChange = (val: React.ChangeEvent<HTMLInputElement>) => {
    setPlayer2Addy(val.target.value);
  };

  const sendTransaction = (transaction: Transaction) => {
	console.log(transaction);
	signAndExecuteTransaction({
		transaction: transaction,
		chain: 'sui:devnet',
	}, {
		onSuccess: (result) => {
			console.log('executed transaction', result);
		},
		onError: (e) => {
			console.log(e);
		}
	});					
};
 
	return (
	<>
		<button className="newGameButton" onClick={async () => sendTransaction(await newGameTx())}>{props.label}</button></>
	);
}

export default NewGameButton;


// {/* <div className="menuElement">
// 		{/* <a href={"/game/"} className='gameListItemLink'>
//             <button className="details-button">View Details</button>
// 		</a> */}

		// {/* </div>*/}


