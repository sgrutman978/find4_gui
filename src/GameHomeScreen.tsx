import React, { ReactNode, useEffect, useState } from 'react';
import NewGameButton from './NewGameButton';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import Find4Animation from './Find4Animation';
import { baseUrl, fetchEvents, GetProfile, port, sendOnlineStatus } from './sui_controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import ProfileButtonAndPanel from './ProfileButtonAndPanel';
import { Profile } from './GameBoard';
import { faDiscord, faTwitter, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import Staking from './Staking';
import axios from 'axios';


function GameHomeScreen() {
	// const autoConnectionStatus = useAutoConnectWallet();
	
	let currentAccount = useCurrentAccount();
	let onlineCount = 0;
	const [myProfile, setMyProfile] = useState<Profile>(); 
	let myInterval = setInterval(() => {}, 50000);
	const [myGames, setMyGames] = useState<any[]>([]);

	useEffect(() => { 
        if(currentAccount){
            GetProfile(currentAccount.address).then((profile) => {
                setMyProfile(profile);
            });
			sendOnlineStatus(currentAccount?.address!);
			getOnlineCount();
			getMyGames(currentAccount?.address!);
        };
    }, [currentAccount]);

	useEffect(() => {
		console.log("init");
		clearInterval(myInterval);
		myInterval = setInterval(() => {
			if(currentAccount){
				sendOnlineStatus(currentAccount?.address!);
				getOnlineCount();
				getMyGames(currentAccount?.address);
			}
		}, 10000);
	}, [currentAccount]);

	const getOnlineCount = async () => {
		try {
			console.log("get onlie count");
			const response = await axios.get(`${baseUrl}:${port}/howmanyonline`);
			console.log(response.data.size);
			onlineCount = response.data.size;
		} catch (error) {
			console.log(error);
		}
	};

	const getMyGames = async (addy: string) => {
		try {
			const response = await axios.get(`${baseUrl}:${port}/myGames?addy=${addy}`);
			console.log(response.data.games);
			setMyGames(response.data.games);
		} catch (error) {
			console.log(error);
		}
	};

	const getMyGamesObjects = () => {
		let els: any = [];
		myGames.forEach((game) => {
			console.log(game);
			els.push(
			<div className="existingGame" onClick={() => window.location.href = `/app/game/${game.id}`}>
				{game.p1 == currentAccount?.address ? game.p2 : game.p1}
			</div>);
		})
		return <div className='existingGamesContainer'>{els}</div>;
	}

  return (
		<div className="gameHomeScreen">
			<div className="logo_app_home">
				{/* <span style={{position: "relative", bottom: 34, fontSize: 200}}>Find</span><img src="../f4-42.png" style={{width: 210, height: 210, marginLeft: 3, bottom: 4, position: "relative"}} /><span style={{position: "relative", bottom: 33, fontSize: 200}}>.io</span> */}
				<div className="gameHomeLogoDiv" onClick={() => window.location.href = '/'}><img src="../logo.png" className="gameHomeLogo" /></div>
				<NewGameButton gameType="single" label="Singleplayer" disabled={false}></NewGameButton>
				{/* (Singleplayer Coming Soon) */}
				<NewGameButton gameType="multi" label="Multiplayer" disabled={false} trophies={myProfile?.points}></NewGameButton>
				{/* (Coming to mainnet soon! Earn trophies on testnet for mainnet airdrop!) */}
				{getMyGamesObjects()}
			</div>
			<div className="connectButtonWrapper">
				<ProfileButtonAndPanel></ProfileButtonAndPanel>
				<ConnectButton></ConnectButton>
				{/* <Staking></Staking> */}
			</div>
			{/* <div className="newButtonsContainer">

			</div> */}
			{/* <div className="gameHomeFooter">
				<a href="https://x.com/Find4_io" className="noDecs" target="_blank"><FontAwesomeIcon icon={faXTwitter} className="gameHomeFooterIcon" style={{marginRight: 18}}/></a>
				<a href="https://discord.com/invite/pYsHzwZ82S" className="noDecs" target="_blank"><FontAwesomeIcon icon={faDiscord} className="gameHomeFooterIcon" /></a>
			</div> */}
		</div>
  );
}

export default GameHomeScreen;

