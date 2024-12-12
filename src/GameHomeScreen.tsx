import React, { ReactNode, useEffect, useState } from 'react';
import NewGameButton from './NewGameButton';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import Find4Animation from './Find4Animation';
import { fetchEvents, GetProfile } from './sui_controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import ProfileButtonAndPanel from './ProfileButtonAndPanel';
import { Profile } from './GameBoard';


function GameHomeScreen() {
	// const autoConnectionStatus = useAutoConnectWallet();
	
	let currentAccount = useCurrentAccount();
	const [myProfile, setMyProfile] = useState<Profile>(); 

	useEffect(() => { 
        if(currentAccount){
            GetProfile(currentAccount.address).then((profile) => {
                setMyProfile(profile);
            });
        };
    }, [currentAccount]);

  return (
		<div className="gameHomeScreen">
			<a href="/">
				<FontAwesomeIcon icon={faHome} className="yellowHome" />
			</a>
			<span className="logo_app_home">
				<span style={{position: "relative", bottom: 34, fontSize: 200}}>Find</span><img src="../f4-42.png" style={{width: 210, height: 210, marginLeft: 3, bottom: 4, position: "relative"}} /><span style={{position: "relative", bottom: 33, fontSize: 200}}>.io</span>
			</span>
			<div className="connectButtonWrapper">
				<ProfileButtonAndPanel currentAddy={currentAccount?.address!} profile={myProfile}></ProfileButtonAndPanel>
				<ConnectButton></ConnectButton>
			</div>
			<div className="newButtonsContainer">
				<NewGameButton gameType="single" label="Single Player" disabled={true}></NewGameButton>
				<NewGameButton gameType="multi" label="Multiplayer" disabled={false} trophies={myProfile?.points}></NewGameButton>
			</div>
		</div>
  );
}

export default GameHomeScreen;

