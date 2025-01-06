import { getFullnodeUrl, QueryEventsParams, SuiClient, SuiEvent, SuiEventFilter } from '@mysten/sui/client';
import { coinWithBalance, Transaction } from '@mysten/sui/transactions';
import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';
import { Profile } from './GameBoard';

export const suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });
										export let myNetwork = "mainnet";
export const suiClient_Mainnet = new SuiClient({ url: getFullnodeUrl("mainnet") });

export const port = myNetwork == "mainnet" ? 3000 : 3001;
export const baseUrl = "https://moonsui.online"; //"http://157.230.185.221"; // "http://localhost";//"http://157.230.185.221";
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
	  const response = await suiClient.queryEvents(queryParams);
	  const response2 = await suiClient.queryEvents(queryParams2);
	  const response4 = await suiClient.queryEvents(queryParams3);
	  const response3 = [...response.data, ...response2.data, ...response4.data];
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

export const GetProfile = async (addy: String): Promise<Profile> => {
	let data: Profile = {};
    await suiClient.getDynamicFieldObject({
		parentId: innerProfilesTableAddy!,
		name: {
            type: 'address',
            value: addy,
        },
	}).then((data2) => {
		if(data2!.data){
			let tmp = (data2!.data!.content! as any).fields.value.fields;
			console.log(tmp);

			data = {username: tmp.username, points: parseInt(tmp.trophies), profilePicUrl: tmp.image_url};
		}
	});
	return data;
};

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



export async function newSinglePlayerGameTx(): Promise<Transaction>{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::single_player::start_single_player_game2", arguments: [
		tx.sharedObjectRef({
			objectId: gamesTrackerAddy!,
			mutable: true,
			initialSharedVersion: gamesTrackerVersion!
		})
	]});
	return tx;
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
		alert("Create profile to begin playing matches!");
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

export async function player_win(gameID: string, version: string, singleOrMulti: string): Promise<Transaction>{
	const tx = new Transaction();
	if(singleOrMulti == "single"){
		tx.moveCall({ target: `${programAddress}::${singleOrMulti}_player::do_win_stuffs`, arguments: [
			tx.sharedObjectRef({
				objectId: gameID,
				mutable: true,
				initialSharedVersion: version
			}), 
			tx.sharedObjectRef({
				objectId: treasuryAddy!,
				mutable: true,
				initialSharedVersion: initVersion!
			})]
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

