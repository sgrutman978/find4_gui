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
import { faDiscord, faTwitter, faXTwitter } from '@fortawesome/free-brands-svg-icons';


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
			<div className="logo_app_home">
				{/* <span style={{position: "relative", bottom: 34, fontSize: 200}}>Find</span><img src="../f4-42.png" style={{width: 210, height: 210, marginLeft: 3, bottom: 4, position: "relative"}} /><span style={{position: "relative", bottom: 33, fontSize: 200}}>.io</span> */}
				<div className="gameHomeLogoDiv" onClick={() => window.location.href = '/'}><img src="../logo.png" className="gameHomeLogo" /></div>
				<NewGameButton gameType="single" label="Singleplayer" disabled={false}></NewGameButton>
				{/* (Singleplayer Coming Soon) */}
				<NewGameButton gameType="multi" label="Multiplayer" disabled={false} trophies={myProfile?.points}></NewGameButton>
				{/* (Coming to mainnet soon! Earn trophies on testnet for mainnet airdrop!) */}
			</div>
			<div className="connectButtonWrapper">
				<ProfileButtonAndPanel></ProfileButtonAndPanel>
				<ConnectButton></ConnectButton>
			</div>
			{/* <div className="newButtonsContainer">

			</div> */}
			<div className="gameHomeFooter">
				<a href="https://x.com/Find4_io" className="noDecs" target="_blank"><FontAwesomeIcon icon={faXTwitter} className="gameHomeFooterIcon" style={{marginRight: 18}}/></a>
				<a href="https://discord.com/invite/pYsHzwZ82S" className="noDecs" target="_blank"><FontAwesomeIcon icon={faDiscord} className="gameHomeFooterIcon" /></a>
			</div>
		</div>
  );
}

export default GameHomeScreen;

