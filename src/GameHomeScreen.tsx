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
import { getHowManyOnline, getProfileFromServer, sendOnlineStatus, updateProfileServer } from './ServerConn';
import { Switch, TextField } from '@mui/material';
import { shortenAddy } from './Utility';


function GameHomeScreen() {
	let currentAccount = useCurrentAccount();
	const [myProfile, setMyProfile] = useState<Profile>(); 
	let intervalId: string | number | NodeJS.Timeout | undefined = undefined;
	const [myGames, setMyGames] = useState<any[]>([]);
	// const [profileSwitch, setProfileSwitch] = useState(0);
	const [refresh, setRefresh] = useState(0);
	const [checked, setChecked] = useState(false);
	const [online, setOnline] = useState(3);
	const [myTurnEls, setMyTurnEls] = useState<any>([]);
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
    }, [currentAccount]);

	useEffect(() => {
		sendOnlineStatus(currentAccount?.address!);
		getMyGames(currentAccount?.address!);
		getOnlineNumber();
	}, [refresh]);

	useEffect(() => {
		setInterval(() => {
			setRefresh(prev => prev + 1);
		}, 10000);
	}, []);

	useEffect(() => {
		if(myGames.length > 0){
			getMyGamesObjects().then((elss) => {
				setEls(elss);
				// console.log(myGames);
				// console.log(els.length);
			});
			getMyTurnGamesObjects().then((elss) => {
				setMyTurnEls(elss);
				// console.log(myGames);
				// console.log(els.length);
			});
		}
	}, [myGames]);

	const getOnlineNumber = () => {
		getHowManyOnline().then((n) => {
			setOnline(3+n);
		});
	}


	const getMyGames = async (addy: string) => {
		try {
			const response = await axios.get(`${baseUrl}:${port}/myGames?addy=${addy}`);
			console.log(response.data.games);
			setMyGames(response.data.games);
		} catch (error) {
			console.log(error);
		}
	};

	const getMyGamesObjectsHelper = async (game: any) => {
		let opponentAddy = (game.p1 == currentAccount?.address ? game.p2 : game.p1);
			return await getProfileFromServer(opponentAddy).then(async (profile) => {
				if(!profile){
					updateProfileServer(opponentAddy);
				}
				console.log(game.id);
				if(game.id == "0x96657f3c1c2a6024334463587f885a1a4af7ecfdf8280e55942f26d9c200ef42"){
					console.log(game);
				}
				return (<div className="existingGame" onClick={() => {window.location.href = `/app/game/${game.id}`}}>
					{(!game.winner ? (((game.type == 1 && game.currentPlayerTurn == 1) || 
						(game.type == 2 && ((game.currentPlayerTurn == 1 && currentAccount?.address == game.p1) || (game.currentPlayerTurn == 2 && currentAccount?.address == game.p2)))) ? 
						<div style={{position: 'relative', backgroundColor: '#90EE90', padding: 3}}>Your Turn</div> : <div style={{position: 'relative', backgroundColor: '#ffcccb', padding: 3}}>Waiting...</div>) : 
						((game.type == 1 && game.winner == 1) || 
						(game.type == 2 && ((game.winner == 1 && currentAccount?.address == game.p1) || (game.winner == 2 && currentAccount?.address == game.p2)))) ? 
						<div style={{position: 'relative', backgroundColor: 'green', padding: 3}}>Winner!</div> : <div style={{position: 'relative', backgroundColor: 'red', padding: 3}}>Loser</div>)}
					{game.type == 2 ? <div style={{margin: 'auto', marginTop: 5}}><FontAwesomeIcon icon={faUser}  /> {(profile ? profile.username : shortenAddy(opponentAddy) )}</div> : <div style={{margin: 'auto', marginTop: 5}}><FontAwesomeIcon icon={faRobot} /></div>}
					<FontAwesomeIcon icon={faDice}  /> {shortenAddy(game.id)}
				</div>);
			}).catch(e => {
				console.log(e);
			});
	};

	const getMyGamesObjects = async (): Promise<any> => {
		customSort();
		const results = await Promise.all(myGames.map(async (game) => {
			// if its my turn dont add to normal games
			if(  !(!game.winner && ((game.type == 1 && game.currentPlayerTurn == 1) || (game.type == 2 && ((game.currentPlayerTurn == 1 && currentAccount?.address == game.p1) || (game.currentPlayerTurn == 2 && currentAccount?.address == game.p2)))))){
            	return await getMyGamesObjectsHelper(game);
			}
        }));
		return results;
	}

	const getMyTurnGamesObjects = async (): Promise<any> => {
		customSort();
		const results = await Promise.all(myGames.map(async (game) => {
			// if its my turn dont add to normal games
			if(  (!game.winner && ((game.type == 1 && game.currentPlayerTurn == 1) || (game.type == 2 && ((game.currentPlayerTurn == 1 && currentAccount?.address == game.p1) || (game.currentPlayerTurn == 2 && currentAccount?.address == game.p2)))))){
            	return await getMyGamesObjectsHelper(game);
			}
        }));
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
				<div className="gameHomeLogoDiv" onClick={() => window.location.href = '/'}>
					<img src="../logo.png" className="gameHomeLogo" />
				</div>
				<div className="onlineDiv" style={{justifyContent: "center", overflow: "visible", height: 0}}>
					<div className="onlineBlack">
						<div className="onlineGreen"></div>{online} Online
					</div>
				</div>
				<div className="newButtonsHolder">
					<NewGameButton gameType="single" label="Singleplayer" disabled={false} trophies={myProfile?.points}></NewGameButton>
					<NewGameButton gameType="multi" label="Multiplayer" disabled={false} trophies={myProfile?.points}></NewGameButton>
					<NewGameButton gameType="challenge" label="Challenge" disabled={false} trophies={myProfile?.points}></NewGameButton>
				</div>
				<span style={{marginTop: 36, fontSize: "27px"}}>Show My Other Games<Switch color="default" onChange={handleChange} /></span>
				<div className='existingGamesContainer'>{checked ? [...myTurnEls, ...els] : myTurnEls}</div>
				{/* {checked ? <div className='existingGamesContainer'>{els}</div> : ""} */}
			</div>
			<div className="connectButtonWrapper">
				<ProfileButtonAndPanel></ProfileButtonAndPanel>
				<ConnectButton></ConnectButton>
			</div>
		</div>
  );
}

export default GameHomeScreen;

