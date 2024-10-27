import { getFullnodeUrl, QueryEventsParams, SuiClient, SuiEvent, SuiEventFilter } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { Transaction } from '@mysten/sui/transactions';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';
import { useEffect, useState } from 'react';

export const myNetwork = "testnet";
export const programAddress = '0x66af7a7613fb0664c30856ae311462a04252a24337be021be9d9882d674ea3c7';
const waitlistAddy = "0x14379bd69d41e21df1a0d6771d269923942928531362f24ec361419ad7984a00";
// const wss = "wss://api.blockeden.xyz/sui/devnet/GLpcqkWTRXogPgJ3J8G5";
export const suiClient = new SuiClient({ url: getFullnodeUrl(myNetwork) });

  export const fetchEvents = async () => {
	try {
	  // Define the query parameters for the events you want to track
	  let queryParams: QueryEventsParams = {
		query: {MoveEventModule: { package: programAddress, module: "single_player"}},
		order: "descending",
		limit: 10,
	  };
	  let queryParams2: QueryEventsParams = {
		query: {MoveEventModule: { package: programAddress, module: "multi_player"}},
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

export async function newSinglePlayerGameTx(): Promise<Transaction>{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::single_player::start_single_player_game"});
	return tx;
}

export async function newMultiPlayerGameTx(): Promise<Transaction>{
	const tx = new Transaction();
	await GetObjectContents(waitlistAddy).then((x) => {
		// console.log(x);
		tx.moveCall({ target: programAddress+"::multi_player::attempt_pairing", arguments: [
			tx.sharedObjectRef({
				objectId: waitlistAddy,
				mutable: true,
				initialSharedVersion: x["version"].Shared.initial_shared_version
			})] 
		}); 
	});
	return tx;
}

export function player_move(gameID: string, column: number, version: string, singleOrMulti: string): Transaction{
	// console.log(gameID);
	// console.log(singleOrMulti);
	// console.log(version);
	const tx = new Transaction();
	tx.moveCall({ target: `${programAddress}::${singleOrMulti}_player::player_make_move`, arguments: [tx.sharedObjectRef({
		objectId: gameID,
		mutable: true,
		initialSharedVersion: version
	}), tx.pure.u64(column)]});
	return tx;
}
