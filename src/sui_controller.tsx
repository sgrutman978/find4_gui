import { getFullnodeUrl, PaginatedObjectsResponse, QueryEventsParams, SuiClient, SuiEvent, SuiEventFilter, SuiObjectData } from '@mysten/sui/client';
import { coinWithBalance, Transaction } from '@mysten/sui/transactions';
import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';
import { Profile } from './GameBoard';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useEnokiFlow } from '@mysten/enoki/react';
import { executeTransactionBlockWithoutSponsorship,  } from './enoki_controller';
import { AuthProvider, EnokiFlow } from '@mysten/enoki';
import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import type { WalletAccount } from '@mysten/wallet-standard';

export const suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });
export let myNetwork = "mainnet";
export const suiClient_Mainnet = new SuiClient({ url: getFullnodeUrl("mainnet") });

export const port = myNetwork == "mainnet" ? 3000 : 3001;
export const baseUrl =  "https://moonsui.online"; //"http://157.230.185.221"; // "http://localhost";
export const programAddress = myNetwork == "mainnet" ? process.env.REACT_APP_PROGRAM_ADDY_MAINNET : process.env.REACT_APP_PROGRAM_ADDY;
export const nonceAddy = myNetwork == "mainnet" ? process.env.REACT_APP_NONCE_ADDY_MAINNET : process.env.REACT_APP_NONCE_ADDY;
export const treasuryAddy = myNetwork == "mainnet" ? process.env.REACT_APP_TREASURY_ADDY_MAINNET : process.env.REACT_APP_TREASURY_ADDY;
export const profileTableAddy = myNetwork == "mainnet" ? process.env.REACT_APP_PROFILE_TABLE_ADDY_MAINNET : process.env.REACT_APP_PROFILE_TABLE_ADDY;
export const innerProfilesTableAddy = myNetwork == "mainnet" ? process.env.REACT_APP_INNER_PROFILES_TABLE_ADDY_MAINNET : process.env.REACT_APP_INNER_PROFILES_TABLE_ADDY;
export const stakingPoolAddy = myNetwork == "mainnet" ? process.env.REACT_APP_STAKING_POOL_ADDY_MAINNET : process.env.REACT_APP_STAKING_POOL_ADDY;
export const stakingPoolVersion = myNetwork == "mainnet" ? process.env.REACT_APP_INIT_VERSION_STAKING_POOL_MAINNET : process.env.REACT_APP_INIT_VERSION_STAKING_POOL;
export const initVersion = myNetwork == "mainnet" ? process.env.REACT_APP_INIT_VERSION_MAINNET : process.env.REACT_APP_INIT_VERSION;
export const OGAddyForEventObjType = myNetwork == "mainnet" ? process.env.REACT_APP_ORIGINAL_ADDRESS_FOR_EVENT_AND_OBJECT_TYPE_MAINNET : process.env.REACT_APP_ORIGINAL_ADDRESS_FOR_EVENT_AND_OBJECT_TYPE;
export const gamesTrackerAddy = myNetwork == "mainnet" ? process.env.REACT_APP_GAMES_TRACKER_ADDY_MAINNET : process.env.REACT_APP_GAMES_TRACKER_ADDY;
export const innergamesTrackerAddy = myNetwork == "mainnet" ? process.env.REACT_APP_GAMES_TRACKER_INNER_ADDY_MAINNET : process.env.REACT_APP_GAMES_TRACKER_INNER_ADDY;
export const gamesTrackerVersion = myNetwork == "mainnet" ? process.env.REACT_APP_INIT_VERSION_GAMES_TRACKER_MAINNET : process.env.REACT_APP_INIT_VERSION_GAMES_TRACKER;
export const presaleStateMainnet = myNetwork == "mainnet" ? process.env.REACT_APP_PRESALE_STATE_ADDY_MAINNET : process.env.REACT_APP_PRESALE_STATE_ADDY;


// export const suiClient = new SuiClient({ url: "https://sui-testnet.blockvision.org/v1/2q0KQSQxISsyOkl0sqvrvu0RDPk" });

// export const programAddress_Mainnet = myNetwork == "mainnet" ? process.env.REACT_APP_PROGRAM_ADDY_MAINNET;
// export const OGAddyForEventObjType_Mainnet = myNetwork == "mainnet" ? process.env.REACT_APP_ORIGINAL_ADDRESS_FOR_EVENT_AND_OBJECT_TYPE_MAINNET;
export default class GameSuiteClient{
	enokiFlow: EnokiFlow = useEnokiFlow();
	currentAccount: WalletAccount | null; 
	myAddy: string = "";
	isEnoki: boolean = false;
	signAndExec: any;
	
	constructor(enokiFlow: EnokiFlow, currentAccount: WalletAccount | null, signAndExec: any){
		this.enokiFlow = enokiFlow;
		this.currentAccount = currentAccount;
		this.signAndExec = signAndExec;
		this.enokiFlow.$zkLoginState.subscribe((state) => {
			if(state?.address!){
            	this.myAddy = state?.address!;
				console.log("yyyyyy");
				console.log(state.address);
				this.isEnoki = true;
			}else{
				if(currentAccount?.address!){
					this.myAddy = currentAccount?.address!;
				}
			}
        });
	}

	handleEnokiLogins(redirectUrl: string, provider: AuthProvider, clientId: string){
        this.enokiFlow.createAuthorizationURL({
            provider: provider,
            network: 'mainnet',
            clientId: clientId,
            redirectUrl,
            extraParams: {
                scope: ['openid', 'email', 'profile'],
            },
        }).then((url) => {
            window.location.href = url;
        }).catch((error) => {
            console.error(error);
        });
	}

	logoutEnoki(){
		this.enokiFlow.logout();
	}

	doTransaction(transaction: Transaction, callback: (result: any) => void, errorCallback?: (error: any) => void) {
		console.log("ENOKI CHECCCCCCKK");
		if(this.isEnoki){
			executeTransactionBlockWithoutSponsorship(transaction, this.enokiFlow, suiClient, callback, errorCallback);
		}else{
			this.doTraditionalTransaction(transaction, callback, errorCallback);
		}
	};
	
	doTraditionalTransaction(transaction: Transaction, callback: (result: any) => void, errorCallback?: (error: any) => void) {
		// const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
		this.signAndExec({
			transaction: transaction!,
			chain: `sui:${myNetwork}`,
		}, {
			onSuccess: (result: any) => {
				console.log('executed transaction', result);
				callback(result);
			},
			onError: (error: any) => {
				console.log(error);
				if(errorCallback){
					errorCallback(error);
				}
			}
		});	
	};
};



  export const fetchEvents = async () => {
	try {
	  let queryParams: QueryEventsParams = {
		query: {MoveEventModule: { package: OGAddyForEventObjType!, module: "single_player"}},
		order: "descending",
		limit: 10,
	  }; 
	  let queryParams2: QueryEventsParams = {
		query: {MoveEventModule: { package: OGAddyForEventObjType!, module: "multi_player"}},
		order: "descending",
		limit: 10,
	  };
	  let queryParams3: QueryEventsParams = {
		query: {MoveEventModule: { package: programAddress!, module: "multi_player"}},
		order: "descending",
		limit: 10,
	  };
	  let queryParams4: QueryEventsParams = {
		query: {MoveEventModule: { package: "0xb31882ffecd729c1dcd7e1884ba9bee60ca4756a87795b46c498de85b0cdfd06", module: "multi_player"}},
		order: "descending",
		limit: 10,
	  };
	  const response = await suiClient.queryEvents(queryParams);
	  const response2 = await suiClient.queryEvents(queryParams2);
	  const response4 = await suiClient.queryEvents(queryParams3);
	  const response5 = await suiClient.queryEvents(queryParams4);
	  const response3 = [...response.data, ...response2.data, ...response4.data, ...response5.data];
	  return response3 || [];
	} catch (error) {
	  console.error('Error fetching events:', error);
	}
  };

export const GetObject = async (id: string): Promise<any> => {
	let data: SuiObjectResponse = {};
    await suiClient.getObject({
		id: id,
		options: {
			showContent: true,
			showOwner: true
		}
	}).then((data2) => {
		data = data2;
	});
	return data;
};

// export async function getSpecificSuiObject(walletAddress: string, objectType: string): Promise<SuiObjectData | undefined> {
//     const objects = await suiClient.getOwnedObjects({
//         owner: walletAddress,
//         options: {
//             showType: true
//         }
//     });
// console.log(objects);
//     // Filter objects by type
//     const matchingObject = objects.data.find((obj) => obj.data?.type === objectType);

//     if (!matchingObject) {
//         console.log('No object of that type found');
//         return undefined;
//     }

//     // Fetch detailed information of the object if needed
//     const objectDetails = await suiClient.getObject({
//         id: matchingObject.data?.objectId!,
//         options: { showContent: true }
//     });

//     return objectDetails.data!;
// }

export async function getSpecificSuiObject(walletAddress: string, objectType: string): Promise<SuiObjectData[]> {
    let cursor: string | null = null;
    let allObjects: SuiObjectData[] = [];
    const QUERY_MAX_RESULT_LIMIT = 50; // Assuming this limit, adjust based on actual Sui API limits

    while (true) {
        const objects: PaginatedObjectsResponse = await suiClient.getOwnedObjects({
            owner: walletAddress,
            cursor: cursor,
            options: {
                showType: true,
                showContent: true // This fetches content details directly, reducing additional calls
            },
            limit: QUERY_MAX_RESULT_LIMIT
        });
		console.log(objects);

        // Filter objects by type
        const matchingObjects = objects.data.filter((obj) => obj.data?.type === objectType && obj.data.objectId != "0x0c63ba3317ce765e234fc28cbb0306f09a5a1972b4621653ea18c45abfb693ee" && obj.data.objectId != "0x28ab9c0876a250fe94dbaa37385ccacd6890fd5f25bbb83c8a7d203ce08c8856");
        allObjects = allObjects.concat((matchingObjects as unknown as SuiObjectData));
		console.log(matchingObjects);

        if (!objects.hasNextPage) {
            break; // No more pages, we're done
        }

        cursor = objects.nextCursor || null;
    }

    return allObjects;
}

// export const GetProfile = async (addy: String): Promise<Profile> => {
// 	let data: Profile = {};
//     await suiClient.getDynamicFieldObject({
// 		parentId: innerProfilesTableAddy!,
// 		name: {
//             type: 'address',
//             value: addy,
//         },
// 	}).then((data2) => {
// 		if(data2!.data){
// 			let tmp = (data2!.data!.content! as any).fields.value.fields;
// 			console.log(tmp);

// 			data = {username: tmp.username, points: parseInt(tmp.trophies), profilePicUrl: tmp.image_url};
// 		}
// 	});
// 	return data;
// };

export const GetObjectContents = async (id: string): Promise<any> => {
	let data: SuiObjectResponse = {};
	let dataSet = false;
	if(id){
    await suiClient.getObject(
		{
			id: id,
			options: {
				showContent: true,
				showOwner: true
			}}
	).then((data2) => {
		data = data2;
		dataSet = true;
	});
	console.log(data);
	return dataSet ? {data: (data?.data?.content as any)["fields"], version: data.data?.owner} : {data: [], version: ""};
	}
};

// export const GetObjectContents_Mainnet = async (id: string): Promise<any> => {
// 	let data: SuiObjectResponse = {};
// 	let dataSet = false;
// 	if(id){
//     await suiClient_Mainnet.getObject(
// 		{
// 			id: id,
// 			options: {
// 				showContent: true,
// 				showOwner: true
// 			}}
// 	).then((data2) => {
// 		data = data2;
// 		dataSet = true;
// 	});
// 	return dataSet ? {data: (data?.data?.content as any)["fields"], version: data.data?.owner} : {data: [], version: ""};
// 	} 
// };



export async function newSinglePlayerGameTx(points: number): Promise<Transaction | undefined>{
	if(points){
		const tx = new Transaction();
		tx.moveCall({ target: programAddress+"::single_player::start_single_player_game3", arguments: [
			tx.sharedObjectRef({
				objectId: gamesTrackerAddy!,
				mutable: true,
				initialSharedVersion: gamesTrackerVersion!
			}),
			coinWithBalance({balance: 20000000})
		]});
		return tx;
	}else{
		alert("Create a profile to begin playing!");
	}
	return undefined;
}
// CHANGE THE BELOW TO START_MULTIPLAYER_GAME ETC NEW METHOD, PASS P2 ADDY IF NOT ALREADY, GET P2 ADDY VIA 
// REQUEST TO BACKEND GIVEN UR NUMBER OF TROPHIES, THEY RETURN CLOSEST ONLINE PLAYER WITH THOSE TROPHIES
//IF NO OTHER ONLINE PLAYERS, GO TO POOL OF OFFLINE PLAYER
//OBVIOUSLY NEED TO IMPLEMENT ONLINE LIST, PLAYERS WHILE ON A PAGE SEND INTO EXPRESS BACKEND SERVER
// THIER ADDY AND EPOCH, SAVES IN MAP ADDY->EPOCH, THEN INTERVAL ON MAP REMOVES KEY-VALS FROM MAP IF (CURRENT_EPOCH - EPOCH_LAST_SEEN < 30)
// THEN A SYSTEM FOR GETTING GAME DATE, SAME IDEA, HAVE MAP WITH GAME_ID->GAME_STATE, IF EVENT FOR GAME COMES IN, REMOVE FROM MAP,
// THEN PLAYER SENDS SERVER REQUEST TO GET GAME DATA, SHOOT RPC FOR GAME DATA, RE-ADD TO MAP, RETURN TO USER
// THIS WAY GAME DATA ONLY BEING GRABBED AFTER ITS CHANGED ANDDDD WHEN SOMEONE WANTS TO VIEW IT
// ANOTHER MAP ADD GAME_ID->EPOCH UPON GAME CREATION
export async function newMultiPlayerGameTx(addy: string, points: number): Promise<Transaction | undefined>{
	if(points){
		const tx = new Transaction();
		console.log(addy);
		await GetObjectContents(nonceAddy!).then(async (x) => {
			tx.moveCall({ target: programAddress+"::multi_player::start_multi_player_game2", arguments: [
				tx.pure.address(addy), 
				tx.object("0x6"),
				tx.sharedObjectRef({
					objectId: gamesTrackerAddy!,
					mutable: true,
					initialSharedVersion: gamesTrackerVersion!
				}),
				tx.sharedObjectRef({
					objectId: nonceAddy!,
					mutable: true,
					initialSharedVersion: initVersion!
				})
				
				// tx.pure.address(profile.id!), 
				// tx.pure.u64(points), 
				
			] 
			}); 
		});
		return tx;
	}else{
		alert("Create a profile to begin playing!");
	}
	return undefined;
}

export async function create_or_edit_profile(username: string, image_url: string): Promise<Transaction>{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::profile_and_rank::add_or_update_profile", arguments: [
		tx.sharedObjectRef({
			objectId: profileTableAddy!,
			mutable: true,
			initialSharedVersion: initVersion!
		}),
		tx.pure.string(image_url), 
		tx.pure.string(username)]});
	return tx;
}

export function player_move(gameID: string, column: number, version: string, singleOrMulti: string): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: `${programAddress}::${singleOrMulti}_player::player_make_move`, arguments: [tx.sharedObjectRef({
		objectId: gameID,
		mutable: true,
		initialSharedVersion: version
	}), tx.pure.u64(column)]});
	return tx;
}

export async function player_win(gameID: string, version: string, singleOrMulti: string, stakedObjId: string | null): Promise<Transaction>{
	const tx = new Transaction();
	let stakedObj = stakedObjId ? [tx.object(stakedObjId!)] : [];
	if(singleOrMulti == "single"){
		tx.moveCall({ target: `${programAddress}::${singleOrMulti}_player::do_win_stuffs${(stakedObjId ? "3" : "2")}`, arguments: [
			tx.sharedObjectRef({
				objectId: gameID,
				mutable: true,
				initialSharedVersion: version
			}), 
			tx.sharedObjectRef({
				objectId: treasuryAddy!,
				mutable: true,
				initialSharedVersion: initVersion!
			}), 
			tx.sharedObjectRef({
				objectId: profileTableAddy!,
				mutable: true,
				initialSharedVersion: initVersion!
			}), ...stakedObj]
		});
		return tx;
	}else{
		tx.moveCall({ target: `${programAddress}::${singleOrMulti}_player::do_win_stuffs`, arguments: [
			tx.sharedObjectRef({
				objectId: gameID,
				mutable: true,
				initialSharedVersion: version
			}),
			tx.sharedObjectRef({
				objectId: profileTableAddy!,
				mutable: true,
				initialSharedVersion: initVersion!
			}),
		]});
		return tx;
	}
}

