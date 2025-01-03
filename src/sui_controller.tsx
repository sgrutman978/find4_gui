import { getFullnodeUrl, QueryEventsParams, SuiClient, SuiEvent, SuiEventFilter } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { coinWithBalance, Transaction } from '@mysten/sui/transactions';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';
import { useEffect, useState } from 'react';
import { Profile } from './GameBoard';

export const myNetwork = "testnet";
export const programAddress = process.env.REACT_APP_PROGRAM_ADDY;

export const nonceAddy = process.env.REACT_APP_NONCE_ADDY;
export const treasuryAddy = process.env.REACT_APP_TREASURY_ADDY;
export const profileTableAddy = process.env.REACT_APP_PROFILE_TABLE_ADDY;
export const innerProfilesTableAddy = process.env.REACT_APP_INNER_PROFILES_TABLE_ADDY;

export const initVersion = process.env.REACT_APP_INIT_VERSION;
export const OGAddyForEventObjType = process.env.REACT_APP_ORIGINAL_ADDRESS_FOR_EVENT_AND_OBJECT_TYPE;
export const suiClient = new SuiClient({ url: getFullnodeUrl(myNetwork) });
export const suiClient_Mainnet = new SuiClient({ url: getFullnodeUrl("mainnet") });
// export const suiClient = new SuiClient({ url: "https://sui-testnet.blockvision.org/v1/2q0KQSQxISsyOkl0sqvrvu0RDPk" });

export const programAddress_Mainnet = process.env.REACT_APP_PROGRAM_ADDY_MAINNET;
export const OGAddyForEventObjType_Mainnet = process.env.REACT_APP_ORIGINAL_ADDRESS_FOR_EVENT_AND_OBJECT_TYPE_MAINNET;

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
	  const response = await suiClient.queryEvents(queryParams);
	  const response2 = await suiClient.queryEvents(queryParams2);
	  const response3 = [...response.data, ...response2.data];
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
	return dataSet ? {data: (data?.data?.content as any)["fields"], version: data.data?.owner} : {data: [], version: ""};
	}
};

export const GetObjectContents_Mainnet = async (id: string): Promise<any> => {
	let data: SuiObjectResponse = {};
	let dataSet = false;
	if(id){
    await suiClient_Mainnet.getObject(
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
	return dataSet ? {data: (data?.data?.content as any)["fields"], version: data.data?.owner} : {data: [], version: ""};
	}
};

export async function newSinglePlayerGameTx(): Promise<Transaction>{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::single_player::start_single_player_game", arguments: []});
	return tx;
}

export async function newMultiPlayerGameTx(addy: string, points: number): Promise<Transaction | undefined>{
	if(points){
		const tx = new Transaction();
		await GetObjectContents(nonceAddy!).then(async (x) => {
			tx.moveCall({ target: programAddress+"::multi_player::add_to_list2", arguments: [
				tx.pure.address(addy), 
				// tx.pure.address(profile.id!), 
				tx.pure.u64(points), 
				tx.sharedObjectRef({
					objectId: nonceAddy!,
					mutable: true,
					initialSharedVersion: initVersion!
				})] 
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

