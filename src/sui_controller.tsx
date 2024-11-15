import { getFullnodeUrl, QueryEventsParams, SuiClient, SuiEvent, SuiEventFilter } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { Transaction } from '@mysten/sui/transactions';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';
import { useEffect, useState } from 'react';
import { ExtendedProfile } from './GameBoard';

export const myNetwork = "testnet";
export const programAddress = process.env.REACT_APP_PROGRAM_ADDY; //"0x6602fc2d11143f63254c851694f614ca5d6f066dc45c4f015f25fa7bcb5df81a";
export const nonceAddy = process.env.REACT_APP_NONCE_ADDY; //"0x6602fc2d11143f63254c851694f614ca5d6f066dc45c4f015f25fa7bcb5df81a";
// const waitlistAddy = "0x4405034aa9d4687dff505c9cb2ea173afb3f2420281288d1d0fa0d9f3b1bdb3b";
// const wss = "wss://api.blockeden.xyz/sui/devnet/GLpcqkWTRXogPgJ3J8G5";
export const suiClient = new SuiClient({ url: getFullnodeUrl(myNetwork) });
export const suiClientMainnet = new SuiClient({ url: getFullnodeUrl("mainnet") });

  export const fetchEvents = async () => {
	try {
	  // Define the query parameters for the events you want to track
	  let queryParams: QueryEventsParams = {
		query: {MoveEventModule: { package: programAddress!, module: "single_player"}},
		order: "descending",
		limit: 10,
	  }; 
	  let queryParams2: QueryEventsParams = {
		query: {MoveEventModule: { package: programAddress!, module: "multi_player"}},
		order: "descending",
		limit: 10,
	  };

	  // Query events using suix_queryEvents method
	  const response = await suiClient.queryEvents(queryParams);
	  const response2 = await suiClient.queryEvents(queryParams2);
	  const response3 = [...response.data, ...response2.data];

	  // Update state with fetched events
	  return response3 || [];
	} catch (error) {
	  console.error('Error fetching events:', error);
	}
  };

	export const fetchProfile = async (address: string): Promise<ExtendedProfile | undefined> => {
		try{
			console.log(address);
		const deets = await suiClient.getOwnedObjects({owner: address});
		// let profile: Profile = {
		// 	profilePicUrl: '',
		// 	username: '',
		// 	points: 0
		// };
		console.log(deets);
		
			return new Promise<ExtendedProfile>((resolve, reject) => {
				deets.data.map(async (object) => {
					// console.log(object.data?.objectId);
					GetObject(object.data?.objectId!).then((profile) => {
						// console.log(profile);
						if (profile.data.content.type == programAddress+"::profile_and_rank::Profile"){
							console.log(profile);
							// console.log(profile.data.content.fields.pointsObj);
							GetObject(profile.data.content.fields.pointsObj).then((points) => {
								// console.log("oeoeoeoeoeoeoeo");
								console.log(profile);
								console.log(points);
								fetchNFTUrl(profile.data.content.fields.profilePicAddy).then((url) => {
									console.log(url);
									resolve({username: profile.data.content.fields.username, pointsAddy: profile.data.content.fields.pointsObj, points: parseInt(points.data.content.fields.points), profilePicUrl: url, id: profile.data.objectId});
								})
								// console.log(profile.data.content.type);
								console.log("ipipipipe");
							});
						}
					})
				});
			});
	// const { data } = useSuiClientQuery('getOwnedObjects', {
	// 	owner: address,
	// });
	// if (!data) {
	// 	return null;
	// }
	// console.log(data);
	// data.data.map((object) => {
	// 	console.log(object.data?.objectId);
	// 	console.log(object.data?.type);
	// });
	// return null;
	// console.log(profile);
	// return profile;
	} catch (error) {
		console.error('Error fetching events:', error);
		return undefined;
	  }
};

export const GetObject = async (id: string): Promise<any> => {
	let data: SuiObjectResponse = {};
    await suiClient.getObject(
		{
			id: id,
			options: {
				showContent: true,
				showOwner: true
			}}
	).then((data2) => {
		data = data2;
	});
	return data;
};

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
		// console.log(data2);
		dataSet = true;
	});
	return dataSet ? {data: (data?.data?.content as any)["fields"], version: data.data?.owner} : {data: [], version: ""};
};

async function fetchNFTUrl(nftObjectId: string): Promise<string> {
	let imageUrl = "";
	console.log(nftObjectId);
	await suiClientMainnet.getObject({
		id: nftObjectId,
		options: {
			showContent: true,
			showOwner: true
		}
	}).then((obj) => {
		console.log(obj);
		imageUrl = (obj?.data?.content as any).fields.image_url;
		// const displayObject = obj.data?.content?.fields?.display;

		// if (displayObject && displayObject.type === 'sui::display::Display') {
		// 	imageUrl = displayObject.fields?.thumbnail_url;
			// const projectUrl = displayObject.fields?.project_url;
			// const creator = displayObject.fields?.creator;

			// Use these values to display the NFT
		// }
	});
	return imageUrl;
}


export async function newSinglePlayerGameTx(pointsAddy: string, points:number): Promise<Transaction>{
	const tx = new Transaction();
	// await GetObjectContents(pointsAddy).then(async (x) => {
		// console.log(x);
		console.log("ueueueueueueu");

		tx.moveCall({ target: programAddress+"::single_player::start_single_player_game", arguments: [tx.pure.address(pointsAddy), tx.pure.u64(points)]});
	// });
	return tx;
}
// addy: address, profileAddy: address, points: u64, nonce: u64
export async function newMultiPlayerGameTx(addy: string, profile: ExtendedProfile): Promise<Transaction>{
	const tx = new Transaction();
	await GetObjectContents(nonceAddy!).then(async (x) => {
		// await GetObjectContents(pointsAddy).then((y) => {
			console.log(x);
			console.log(addy);
			console.log(profile.id!);
			console.log(profile);
			console.log(parseInt(x.data.nonce));
			tx.moveCall({ target: programAddress+"::multi_player::add_to_list", arguments: [
				tx.pure.address(addy), tx.pure.address(profile.id!), tx.pure.u64(profile.points!), tx.pure.u64(parseInt(x.data.nonce))] 
			}); 
		// });
	});
	return tx;
}

export async function createProfile(username: string, nftAddy: string): Promise<Transaction>{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::profile_and_rank::create_profile", arguments: [tx.pure.string(username), tx.pure.address(nftAddy)]});
	return tx;
}

export async function editProfile(username: string, nftAddy: string, profileId: string): Promise<Transaction>{
	const tx = new Transaction();
	await GetObjectContents(profileId).then(async (profile) => {
		console.log(profile.data.version);
		tx.moveCall({ target: programAddress+"::profile_and_rank::edit_profile", arguments: [tx.object(profileId), tx.pure.string(username), tx.pure.address(nftAddy)]});
	});
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

// export function claimIncreasedRank
// add second player first move seperate move call and function
// add popup after win to claim rank increase (and lower opponent's)
