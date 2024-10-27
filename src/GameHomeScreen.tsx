import React, { ReactNode, useEffect, useState } from 'react';
import NewGameButton from './NewGameButton';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import Find4Animation from './Find4Animation';
import { fetchEvents } from './sui_controller';

function GameHomeScreen() {
	const autoConnectionStatus = useAutoConnectWallet();
	const currentAccount = useCurrentAccount();

	let interval = setInterval(() => {}, 50000);
	// let [key, setKey] = useState(0);

	// setInterval(() => {
	// 	getGameCreationEvents();
	// }, 1800);

	useEffect(()=>{
        getEvents();
    },[]) 

	const getGameCreationEvents = () => {
		fetchEvents().then((events) => {
			// console.log("888888")
			// console.log(events);
			events?.forEach((event) => {
				let eventData = event.parsedJson as any;
				let x = (Date.now() - Number(event.timestampMs)) < 2000;
				// console.log(Number(event.timestampMs));
				// console.log(x);
				if (x && (eventData.p1 == currentAccount?.address || eventData.p2 == currentAccount?.address)){
					//redirect to game page the event described
					window.location.href = '/game/'+eventData.game;
				}
			});
		});
	};

    const getEvents = () => {
        clearInterval(interval);
        interval = setInterval(() => {
			getGameCreationEvents();
            console.log("jjdjdjdjdjdjdjdjdjdjdjdjdjdjdj");
            // setKey(prevKey => prevKey + 1);
        }, 1000);
    };

  return (
		<div className="gameHomeScreen">
			<div className="connectButtonWrapper">
				<ConnectButton></ConnectButton>
			</div>
			<Find4Animation />

			{/* {currentAccount ? <div>Auto-connection status: {autoConnectionStatus}</div> : ""} */}
			{/* <br /> My address {currentAccount?.address} */}
			<div className="newButtonsContainer">
				<NewGameButton gameType="single" label="Single Player"></NewGameButton>
				<NewGameButton gameType="multi" label="Multiplayer"></NewGameButton>
			</div>
		</div>
  );
}

export default GameHomeScreen;

