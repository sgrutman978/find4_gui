import React, { ReactNode, useEffect, useState } from 'react';
import NewGameButton from './NewGameButton';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import Find4Animation from './Find4Animation';
import { baseUrl, fetchEvents, /*GetProfile,*/ port } from './sui_controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faHome, faRankingStar, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import ProfileButtonAndPanel from './ProfileButtonAndPanel';
import { Profile } from './GameBoard';
import { faDiscord, faTwitter, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import Staking from './Staking';
import axios from 'axios';
import { getHowManyOnline, getProfileFromServer, sendOnlineStatus } from './ServerConn';
import { Switch, TextField } from '@mui/material';
import { shortenAddy } from './Utility';


function GameHomeScreen() {
	// const autoConnectionStatus = useAutoConnectWallet();
	
	let currentAccount = useCurrentAccount();
	const [myProfile, setMyProfile] = useState<Profile>(); 
	let intervalId: string | number | NodeJS.Timeout | undefined = undefined;
	const [myGames, setMyGames] = useState<any[]>([]);
	const [profileSwitch, setProfileSwitch] = useState(0);
	const [refresh, setRefresh] = useState(0);
	const [checked, setChecked] = useState(false);
	const [online, setOnline] = useState(3);
	const [els, setEls] = useState<any>([]);

	useEffect(() => { 
        if(currentAccount){
            getProfileFromServer(currentAccount.address).then((profile) => {
                setMyProfile(profile);
            });
			sendOnlineStatus(currentAccount?.address!);
			getMyGames(currentAccount?.address!);
			getOnlineNumber();
        };
		// setProfileSwitch(prev => prev + 1);
		// playInterval(profileSwitch);
    }, [currentAccount]);

	useEffect(() => {
		sendOnlineStatus(currentAccount?.address!);
		getMyGames(currentAccount?.address!);
		getOnlineNumber();
	}, [refresh]);

	useEffect(() => {
		// console.log("init");
		// playInterval();
		setInterval(() => {
			// console.log("REFRESH"); 
			setRefresh(prev => prev + 1);
		}, 10000);
	}, []);

	useEffect(() => {
		if(myGames.length > 1){
			getMyGamesObjects().then((elss) => {
				setEls(elss);
				console.log(myGames);
				console.log(els.length);
			});
		}
	}, [myGames]);

	const getOnlineNumber = () => {
		getHowManyOnline().then((n) => {
			// console.log(n);
			setOnline(3+n);
		});
	}

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

	const getMyGames = async (addy: string) => {
		try {
			const response = await axios.get(`${baseUrl}:${port}/myGames?addy=${addy}`);
			// console.log(response.data.games);
			setMyGames(response.data.games);
		} catch (error) {
			console.log(error);
		}
	};



	const getMyGamesObjectsHelper = async (game: any) => {
		let opponentAddy = (game.p1 == currentAccount?.address ? game.p2 : game.p1);
			return await getProfileFromServer(opponentAddy).then(async (profile) => {
				console.log("PPPPPDWEWDUBWJHBJDW");
				// console.log(profile);
			return (<div className="existingGame" onClick={() => window.location.href = `/app/game/${game.id}`}>
				{/* vs: {game.type == 1 ? "AI" : shortenAddy(opponentAddy)}<br /> */}
				{(!game.winner ? (((game.type == 1 && game.currentPlayerTurn == 1) || 
					(game.type == 2 && ((game.currentPlayerTurn == 1 && currentAccount?.address == game.p1) || (game.currentPlayerTurn == 2 && currentAccount?.address == game.p2)))) ? 
					<div style={{position: 'relative', backgroundColor: '#90EE90', padding: 3}}>Your Turn</div> : <div style={{position: 'relative', backgroundColor: '#ffcccb', padding: 3}}>Waiting...</div>) : 
					((game.type == 1 && game.winner == 1) || 
					(game.type == 2 && ((game.winner == 1 && currentAccount?.address == game.p1) || (game.winner == 2 && currentAccount?.address == game.p2)))) ? 
					<div style={{position: 'relative', backgroundColor: 'green', padding: 3}}>Winner!</div> : <div style={{position: 'relative', backgroundColor: 'red', padding: 3}}>Loser</div>)}
				{game.type == 2 ? <div style={{margin: 'auto', marginTop: 5}}><FontAwesomeIcon icon={faUser}  /> {(profile ? profile.username : shortenAddy(opponentAddy) )}</div> : <div style={{margin: 'auto', marginTop: 5}}><FontAwesomeIcon icon={faRobot} /></div>}
				{/* Total Chips Down: {game.nonce}<br /> */}
				<FontAwesomeIcon icon={faDice}  /> {shortenAddy(game.id)}
				{/* {game.winner ? () : (parseInt(game.currentPlayerTurn) == 1 && p1 == currentAccount.address ? "mine")} */}
			</div>);
			}).catch(e => {
				console.log(e);
			});
	};

	const getMyGamesObjects = async (): Promise<any> => {
		let els: any = [];
		customSort();


		

		const results = await Promise.all(myGames.map(async (game) => {
            return await getMyGamesObjectsHelper(game);
        }));
		console.log("RRRRRRRR");
		console.log(results);
		// setEls(results);




		// await myGames.forEach(async (game) => {
		// 	// console.log(game);
			
		// });
		// console.log("TTTTTTTTTTTTTTTTTTTTTTTT");
		// return els;
		return results;
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

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	}

  return (
		<div className="gameHomeScreen">
			<a href="/leaderboard" style={{zIndex: 1000}}>
				<FontAwesomeIcon icon={faRankingStar} className="yellowHome" />
			</a>
			<div className="logo_app_home">
				{/* <span style={{position: "relative", bottom: 34, fontSize: 200}}>Find</span><img src="../f4-42.png" style={{width: 210, height: 210, marginLeft: 3, bottom: 4, position: "relative"}} /><span style={{position: "relative", bottom: 33, fontSize: 200}}>.io</span> */}
				<div className="gameHomeLogoDiv" onClick={() => window.location.href = '/'}>
					<img src="../logo.png" className="gameHomeLogo" />
				</div>
				<div className="onlineDiv" style={{justifyContent: "center", overflow: "visible", height: 0}}>
					<div className="onlineBlack">
						<div className="onlineGreen"></div>{online} Online
					</div>
				</div>
				<div className="newButtonsHolder">
					{/* <span style={{fontSize: "5vw", display: "flex", flexDirection: "column", justifyContent: "center"}}>New:</span> */}
					<NewGameButton gameType="single" label="Singleplayer" disabled={false}></NewGameButton>
					{/* (Singleplayer Coming Soon) */}
					<NewGameButton gameType="multi" label="Multiplayer" disabled={false} trophies={myProfile?.points}></NewGameButton>
					<NewGameButton gameType="challenge" label="Challenge" disabled={false} trophies={myProfile?.points}></NewGameButton>
					{/* (Coming to mainnet soon! Earn trophies on testnet for mainnet airdrop!) */}
				</div>
				<span style={{marginTop: 36, fontSize: "27px"}}>Show My Games<Switch color="default" onChange={handleChange} /></span>

				{checked ? <div className='existingGamesContainer'>{els}</div> : "dd"}
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

