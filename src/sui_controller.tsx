import { getFullnodeUrl, QueryEventsParams, SuiClient, SuiEvent, SuiEventFilter } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { Transaction } from '@mysten/sui/transactions';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';
import { useEffect, useState } from 'react';

export const network = "devnet";
export const programAddress = '0xde6646867ecd4d38a4a77f2773dd5aa01bc4ced9cc0387a02f8f8ebfa06a1f55';
const waitlistAddy = "0x54bbe728dfbf28c84474f88c8f290bb958d6012b1d1577b964e073f76b0171c2";
// const wss = "wss://api.blockeden.xyz/sui/devnet/GLpcqkWTRXogPgJ3J8G5";
export const suiClient = new SuiClient({ url: getFullnodeUrl(network) });







  export const fetchEvents = async () => {
	try {
	  // Define the query parameters for the events you want to track
	  console.log(Date.now());

	  let queryParams: QueryEventsParams = {
		query: {MoveEventModule: { package: programAddress, module: "find_four_game"}},
		order: "descending",
		limit: 10,
	  };


	//   const queryParams = {
		// query: {
			// Any: [
		//   MoveEventType: programAddress+'::find_four_game::PairingEvent', // Replace with your specific event type
		//{
		// MoveEventModule: { package: programAddress, module: "find_four_game"}//},
		//   {TimeRange: {
		// 	startTime: ""+(Date.now()-86400), 
		// 	endTime: ""+(Date.now())
		//   }}
		// ]
		// EventType: "PairingEvent"
		// "TimeRange": {
		// filter: {
			// MoveEvent:"::find_four_game::PairingEvent"
			// Sender: "0x8fe83411bab025786f834ec4afe92c8d8b9d3bd014d740e57440f17fbb39b0a3"
			// l: ""
		// }
		//   },
		// "startTime": Math.floor(Date.now() / 1000) - 30, // 1 hour ago
		// "endTime": Math.floor(Date.now() / 1000), // current time
		// },
		

		// "TimeRange": {
		// 	"startTime": Math.floor(Date.now() / 1000) - 30, // 1 hour ago
		// 	"endTime": Math.floor(Date.now() / 1000), // current time
		//   },
		//   "startTime": Math.floor(Date.now()) - 3000, // 1 hour ago
		//   "endTime": Math.floor(Date.now()), // current time
		// timeRange: {
		// 	startTime: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
		// 	endTime: Math.floor(Date.now() / 1000), // current time
		//   },
		
		// filter: {
        //     TimeRange: {
        //       startTime: Math.floor(Date.now() / 1000) - 30, // 1 hour ago
        //       endTime: Math.floor(Date.now() / 1000), // current time
        //     },
        //   },
	//   };

	//   let x: SuiEventFilter = {};
	  

	  // Query events using suix_queryEvents method
	  const response = await suiClient.queryEvents(queryParams);

	  // Update state with fetched events
	  console.log(response.data);
	  return response.data || [];
	} catch (error) {
	  console.error('Error fetching events:', error);
	}
  };

  

// export const suiClient = new SuiClient({ url: wss });

// import { Connection, JsonRpcProvider } from '@mysten/sui.js';

// const provider = new JsonRpcProvider(
//   new Connection({ fullnode: 'https://api.blockeden.xyz/sui/GLpcqkWTRXogPgJ3J8G5' })
// );
// const totalTransactionBlock = await provider.getTotalTransactionBlocks();
// console.log(totalTransactionBlock);

// var ethers = require("ethers");
// var url = "wss://api.blockeden.xyz/sui/devnet/GLpcqkWTRXogPgJ3J8G5";

// var init = function () {
//   var customWsProvider = new ethers.providers.WebSocketProvider(url);

//   customWsProvider.on("pending", (tx: any) => {
//     customWsProvider.getTransaction(tx).then(function (transaction: any) {
//       console.log(transaction);
//     });
//   });

//   customWsProvider.on("error", async () => {
//     console.log(`Unable to connect to wss://api.blockeden.xyz/sui/GLpcqkWTRXogPgJ3J8G5 retrying in 3s...`);
//     setTimeout(init, 3000);
//   });
//   customWsProvider.on("close", async (code: any) => {
//     console.log(
//       `Connection lost with code ${ code } !Attempting reconnect in 3s...`
//     );
//     customWsProvider._websocket.terminate();
//     setTimeout(init, 3000);
//   });
// };

// init();

// Import necessary modules
// import WebSocket from 'ws'; // Install using `npm install ws`

// Define the WebSocket URL (update this to point to the correct Fullnode WebSocket URL)
// const WS_URL = wss;

// // Function to initialize the WebSocket connection and handle events
// export function subscribeToEvents() {
// 	// Create a new WebSocket connection using the native WebSocket API
// 	const ws = new WebSocket(WS_URL);
  
// 	// Handle the open event when the connection is established
// 	ws.onopen = () => {
// 	  console.log('WebSocket connection opened');
  
// 	  // Define the subscription request for the specific event type
// 	  const subscriptionRequest = {
// 		jsonrpc: '2.0',
// 		id: 1,
// 		method: 'sui_subscribeEvent',
// 		params: [
// 		  {
// 			MoveEventType: '0x2bf3664f890fb4cb503acf7a0f5d2d13b39665de34425409b008ab2cad277646::find_four_game::PairingEvent', // Replace with your specific event type
// 		  },
// 		],
// 	  };
  
// 	  // Send the subscription request to the WebSocket server
// 	  ws.send(JSON.stringify(subscriptionRequest));
// 	};
  
// 	// Handle incoming messages (events)
// 	ws.onmessage = (event) => {
// 	  try {
// 		const data = JSON.parse(event.data as any);
// 		if (data.method === 'sui_subscription') {
// 		  console.log('Event received:', data.params.result);
// 		} else {
// 		  console.log('Received message:', data);
// 		}
// 	  } catch (error) {
// 		console.error('Error parsing message:', error);
// 	  }
// 	};
  
// 	// Handle any errors that occur with the WebSocket connection
// 	ws.onerror = (error) => {
// 	  console.error('WebSocket error:', error);
// 	};
  
// 	// Handle when the WebSocket connection is closed
// 	ws.onclose = (event) => {
// 	  console.log(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
// 	};
  
// 	// Gracefully close the WebSocket connection when the page is closed or refreshed
// 	window.addEventListener('beforeunload', () => {
// 	  ws.close();
// 	});
//   }

// // Start the WebSocket subscription
// subscribeToEvents();


export const GetObjectContents = async (id: string): Promise<any> => {
	let data: SuiObjectResponse = {};
	let dataSet = false;
    await suiClient.getObject(
		{
			id: id,
			options: {
				showContent: true,
				showOwner: true
			}}
	).then((data2) => {
		data = data2;
		console.log(data2);
		dataSet = true;
	});
	return dataSet ? {data: (data?.data?.content as any)["fields"], version: data.data?.owner} : {data: [], version: ""};
	// useSuiClientQuery('getObject', {
    //     id: id,
    //     options: {
    //         showContent: true,
	// 		showOwner: true
    //     }
    // });
	// console.log(data);
    
};

export async function newGameTx(): Promise<Transaction>{
	const tx = new Transaction();
	await GetObjectContents(waitlistAddy).then((x) => {
		console.log(x);
		tx.moveCall({ target: programAddress+"::find_four_game::attempt_pairing", arguments: [
			tx.sharedObjectRef({
				objectId: waitlistAddy,
				mutable: true,
				initialSharedVersion: x["version"].Shared.initial_shared_version
			})] 
		}); 
	});
	return tx;
}

export function player_move(gameID: string, column: number, version: string): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::find_four_game::player_move", arguments: [tx.sharedObjectRef({
		objectId: gameID,
		mutable: true,
		initialSharedVersion: version
	}), tx.pure.u64(column)]});
	return tx;
}
