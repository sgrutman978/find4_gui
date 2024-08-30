import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { newGameTx } from './sui_controller';
// import { GetGameParticipationObjects, GetObjectContents, newGameTx } from './sui_controller';
// import { SuiObjectResponse } from '@mysten/sui/dist/cjs/client';
// import { checkIfMyTurn } from './GameBoard';
 
function Home() {
	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	const [digest, setDigest] = useState('');
	const currentAccount = useCurrentAccount();
  	const [player2Addy, setPlayer2Addy] = useState('');
  	// const [gameParticipates, setGameParticipation] = useState([{}]);
	// const p = GetGameParticipationObjects(currentAccount?.address!);
	// console.log(p);

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
 
	return (<>
		<a href={"/game/"/*+game_addy*/} className='gameListItemLink'>
            <button className="details-button">View Details</button>
		</a>
		<button onClick={() => sendTransaction(newGameTx("0x8418bb05799666b73c4645aa15e4d1ccae824e1487c01a665f51767826d192b7"))}>NEW GAME</button>
		</>
	);
}

export default Home;





