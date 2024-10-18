import React from 'react';
import NewGameButton from './NewGameButton';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';

function GameHomeScreen() {
	const autoConnectionStatus = useAutoConnectWallet();
	const currentAccount = useCurrentAccount();
  return (
		<div className="gameHomeScreen">
			<div className="connectButtonWrapper">
				<ConnectButton></ConnectButton>
			</div>
			{/* {currentAccount ? <div>Auto-connection status: {autoConnectionStatus}</div> : ""} */}
			{/* <br /> My address {currentAccount?.address} */}
			<div className="newButtonsContainer">
				<NewGameButton label="Single Player"></NewGameButton>
				<NewGameButton label="Multiplayer"></NewGameButton>
			</div>
		</div>
  );
}

export default GameHomeScreen;

