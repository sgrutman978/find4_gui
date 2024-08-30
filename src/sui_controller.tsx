import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { Transaction } from '@mysten/sui/transactions';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';

export const programAddress = '0x4c4db8d158750a0d588a95ada9c2a01ecec3883430cf8ff4f858808005cb2b74';

export const GetObjectContents = async (id: string): Promise<any> => {
	const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') });
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

export function newGameTx(player2: string): Transaction{
	const tx = new Transaction();
	tx.moveCall({ target: programAddress+"::find_four_game::initialize_game", arguments: [tx.pure.address(player2)] });
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
