import React, { ReactNode, useEffect, useState } from 'react';
import NewGameButton from './NewGameButton';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import Find4Animation from './Find4Animation';
import { fetchEvents } from './sui_controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import ProfileButtonAndPanel from './ProfileButtonAndPanel';


function GameHomeScreen() {
	const autoConnectionStatus = useAutoConnectWallet();
	const currentAccount = useCurrentAccount();
	const [currentAddy, setCurrentAddy] = useState("");

	let interval = setInterval(() => {}, 50000);
	// let [key, setKey] = useState(0);

	// setInterval(() => {
	// 	getGameCreationEvents();
	// }, 1800);

	useEffect(()=>{
        getEvents();
    },[]) 

	useEffect(()=>{
        console.log("inejfbhwbrfhjbwjh");
		console.log(currentAccount?.address);
			console.log(currentAddy);
			if (currentAccount && currentAccount!.address != currentAddy){
				console.log(currentAccount!.address);
				setCurrentAddy(() => currentAccount!.address);
			}
			if(!currentAccount && currentAddy != ""){
				setCurrentAddy("");
			}
    },[currentAccount]) 

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
					window.location.href = '/app/game/'+eventData.game;
				}
			});
		});
	};

    const getEvents = () => {
        clearInterval(interval);
        interval = setInterval(() => {
			getGameCreationEvents();
            // console.log("jjdjdjdjdjdjdjdjdjdjdjdjdjdjdj");
            // setKey(prevKey => prevKey + 1);
        }, 1000);
    };

  return (
		<div className="gameHomeScreen">
			<a href="/">
				<FontAwesomeIcon icon={faHome} className="yellowHome" />
			</a>

			<span className="logo_app_home">
				<span style={{position: "relative", bottom: 34, fontSize: 200}}>Find</span><img src="../f4-42.png" style={{width: 210, height: 210, marginLeft: 3, bottom: 4, position: "relative"}} /><span style={{position: "relative", bottom: 33, fontSize: 200}}>.io</span>
			</span>
     
			<div className="connectButtonWrapper">
				<ProfileButtonAndPanel currentAddy={currentAddy}></ProfileButtonAndPanel>
				<ConnectButton></ConnectButton>
			</div>
			{/* <div className="find4AnimationContainer" key={"animationContainer"+Date.now()}>
				<Find4Animation size={10} animated={true} />
			</div> */}
			
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

