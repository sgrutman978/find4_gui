import React, { ReactNode, useEffect, useState } from 'react';
import NewGameButton from './NewGameButton';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import Find4Animation from './Find4Animation';
import { baseUrl, fetchEvents, GetProfile, port } from './sui_controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faHome, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import ProfileButtonAndPanel from './ProfileButtonAndPanel';
import { Profile } from './GameBoard';
import { faDiscord, faTwitter, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import Staking from './Staking';
import axios from 'axios';
import { sendOnlineStatus } from './ServerConn';


function GameHomeScreen() {
	// const autoConnectionStatus = useAutoConnectWallet();
	
	let currentAccount = useCurrentAccount();
	let onlineCount = 0;
	const [myProfile, setMyProfile] = useState<Profile>(); 
	let intervalId: string | number | NodeJS.Timeout | undefined = undefined;
	const [myGames, setMyGames] = useState<any[]>([]);
	const [profileSwitch, setProfileSwitch] = useState(0);
	const [refresh, setRefresh] = useState(0);

	useEffect(() => { 
        if(currentAccount){
            GetProfile(currentAccount.address).then((profile) => {
                setMyProfile(profile);
            });
			sendOnlineStatus(currentAccount?.address!);
			getOnlineCount();
			getMyGames(currentAccount?.address!);
        };
		// setProfileSwitch(prev => prev + 1);
		// playInterval(profileSwitch);
    }, [currentAccount]);

	useEffect(() => {
		sendOnlineStatus(currentAccount?.address!);
		getOnlineCount();
		getMyGames(currentAccount?.address!);
	}, [refresh]);

	useEffect(() => {
		// console.log("init");
		// playInterval();
		setInterval(() => {
			// console.log("REFRESH"); 
			setRefresh(prev => prev + 1);
		}, 10000);
	}, []);

	// const playInterval = (mySwitch: number) => {
	// 	console.log("SWITCHES");
	// 	console.log(profileSwitch);
	// 	console.log(mySwitch);
	// 	if(profileSwitch == mySwitch){
	// 		setTimeout(() => {
	// 			if(currentAccount){
	// 				sendOnlineStatus(currentAccount?.address!);
	// 				getOnlineCount();
	// 				getMyGames(currentAccount?.address);
	// 			}
	// 			playInterval(mySwitch);
	// 		}, 10000);
	// 	}
	// }

	const getOnlineCount = async () => {
		try {
			// console.log("get onlie count");
			const response = await axios.get(`${baseUrl}:${port}/howmanyonline`);
			// console.log(response.data.size);
			onlineCount = response.data.size;
		} catch (error) {
			console.log(error);
		}
	};

	const getMyGames = async (addy: string) => {
		try {
			const response = await axios.get(`${baseUrl}:${port}/myGames?addy=${addy}`);
			// console.log(response.data.games);
			setMyGames(response.data.games);
		} catch (error) {
			console.log(error);
		}
	};

	const getMyGamesObjects = () => {
		let els: any = [];
		customSort();
		myGames.forEach((game) => {
			// console.log(game);
			let opponentAddy = (game.p1 == currentAccount?.address ? game.p2 : game.p1);
			els.push(
			<div className="existingGame" onClick={() => window.location.href = `/app/game/${game.id}`}>
				{/* vs: {game.type == 1 ? "AI" : shortenAddy(opponentAddy)}<br /> */}
				{(!game.winner ? (((game.type == 1 && game.currentPlayerTurn == 1) || 
					(game.type == 2 && ((game.currentPlayerTurn == 1 && currentAccount?.address == game.p1) || (game.currentPlayerTurn == 2 && currentAccount?.address == game.p2)))) ? 
					<div style={{position: 'relative', backgroundColor: '#90EE90', padding: 3}}>Your Turn</div> : <div style={{position: 'relative', backgroundColor: '#ffcccb', padding: 3}}>Waiting...</div>) : 
					((game.type == 1 && game.winner == 1) || 
					(game.type == 2 && ((game.winner == 1 && currentAccount?.address == game.p1) || (game.winner == 2 && currentAccount?.address == game.p2)))) ? 
					<div style={{position: 'relative', backgroundColor: 'green', padding: 3}}>Winner!</div> : <div style={{position: 'relative', backgroundColor: 'red', padding: 3}}>Loser</div>)}
				{game.type == 2 ? <div style={{margin: 'auto', marginTop: 5}}><FontAwesomeIcon icon={faUser}  /> {shortenAddy(opponentAddy)}</div> : <div style={{margin: 'auto', marginTop: 5}}><FontAwesomeIcon icon={faRobot} /></div>}
				{/* Total Chips Down: {game.nonce}<br /> */}
				<FontAwesomeIcon icon={faDice}  /> {shortenAddy(game.id)}
				{/* {game.winner ? () : (parseInt(game.currentPlayerTurn) == 1 && p1 == currentAccount.address ? "mine")} */}
			</div>);
		})
		return <div className='existingGamesContainer'>{els}</div>;
	}

	function customSort() {
		return myGames.sort((a, b) => {
			const aHasWinner = 'winner' in a;
			const bHasWinner = 'winner' in b;
	
			// Both do not have 'winner'
			if (!aHasWinner && !bHasWinner) {
				const aIsMyTurn = ((a.type == 1 && a.currentPlayerTurn == 1) || (a.type == 2 && ((a.currentPlayerTurn == 1 && currentAccount?.address == a.p1) || (a.currentPlayerTurn == 2 && currentAccount?.address == a.p2))));
				const bIsMyTurn = ((b.type == 1 && b.currentPlayerTurn == 1) || (b.type == 2 && ((b.currentPlayerTurn == 1 && currentAccount?.address == b.p1) || (b.currentPlayerTurn == 2 && currentAccount?.address == b.p2))));
				
				if (aIsMyTurn && !bIsMyTurn) return -1;
				if (!aIsMyTurn && bIsMyTurn) return 1;
				return 0; // Both are the same regarding 'isMyTurn'
			}
	
			// 'a' does not have 'winner', 'b' does
			if (!aHasWinner && bHasWinner) return -1;
	
			// 'a' has 'winner', 'b' does not
			if (aHasWinner && !bHasWinner) return 1;
	
			// Both have 'winner'
			if (a.winner === true && b.winner === false) return -1;
			if (a.winner === false && b.winner === true) return 1;
			return 0; // Both winners are the same
		});
	}

	const shortenAddy = (addy: string) => {
		const first = addy.slice(0, 7);
		let lastFive = addy.slice(-5);
		return `${first}...${lastFive}`;
	}

  return (
		<div className="gameHomeScreen">
			<div className="logo_app_home">
				{/* <span style={{position: "relative", bottom: 34, fontSize: 200}}>Find</span><img src="../f4-42.png" style={{width: 210, height: 210, marginLeft: 3, bottom: 4, position: "relative"}} /><span style={{position: "relative", bottom: 33, fontSize: 200}}>.io</span> */}
				<div className="gameHomeLogoDiv" onClick={() => window.location.href = '/'}><img src="../logo.png" className="gameHomeLogo" /></div>
				<div className="newButtonsHolder">
					<span style={{fontSize: "5vw", display: "flex", flexDirection: "column", justifyContent: "center"}}>New:</span>
					<NewGameButton gameType="single" label="Singleplayer" disabled={false}></NewGameButton>
					{/* (Singleplayer Coming Soon) */}
					<NewGameButton gameType="multi" label="Multiplayer" disabled={false} trophies={myProfile?.points}></NewGameButton>
					{/* (Coming to mainnet soon! Earn trophies on testnet for mainnet airdrop!) */}
				</div>
				<span style={{marginTop: 36, fontSize: "27px"}}>My Games</span>
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

