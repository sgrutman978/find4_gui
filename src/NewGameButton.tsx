import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { newMultiPlayerGameTx, fetchEvents, myNetwork, newSinglePlayerGameTx, fetchProfile } from './sui_controller';
import { ExtendedProfile } from './GameBoard';
 
 function NewGameButton(props: any) {
	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	const [digest, setDigest] = useState('');
	const currentAccount = useCurrentAccount();
  	const [player2Addy, setPlayer2Addy] = useState('');

  const handleChange = (val: React.ChangeEvent<HTMLInputElement>) => {
    setPlayer2Addy(val.target.value);
  };

  const sendTransaction = async () => {
	if (!currentAccount){
		alert("Please connect a SUI wallet");
	} else {
		fetchProfile(currentAccount.address).then(async (profile) => {
			if(profile){
				// console.log(profile);
				let transaction = props.gameType == "single" ? await newSinglePlayerGameTx(profile.pointsAddy!, profile.points!) : await newMultiPlayerGameTx(currentAccount.address, profile);
				// console.log(transaction);
				signAndExecuteTransaction({
					transaction: transaction,
					chain: `sui:${myNetwork}`,
				}, {
					onSuccess: (result) => {
						console.log('executed transaction', result);
					},
					onError: (e) => {
						console.log(e);
					}
				});	
			}
		});
	}				
};
 
	return (
	<>
		<button className="newGameButton" onClick={() => sendTransaction()} disabled={false}>{props.label}</button>
	</>
	);
}

export default NewGameButton;
