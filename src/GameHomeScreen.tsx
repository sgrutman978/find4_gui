import React, { ReactNode, useEffect, useState } from 'react';
import NewGameButton from './NewGameButton';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import Find4Animation from './Find4Animation';
import { fetchEvents, GetProfile } from './sui_controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import ProfileButtonAndPanel from './ProfileButtonAndPanel';
import HandleMultiPlayerCreateGameEvents from './HandleMultiPlayerCreateGameEvents';
import { Profile } from './GameBoard';


function GameHomeScreen() {
	// const autoConnectionStatus = useAutoConnectWallet();
	
	let currentAccount = useCurrentAccount();
	const [myProfile, setMyProfile] = useState<Profile>();

	// console.log("dsfsdgfsdg");

	useEffect(() => { 
        if(currentAccount){
            GetProfile(currentAccount.address).then((profile) => {
                setMyProfile(profile);
            });
        };
        // fetchProfile(props.currentAddy).then(async (profile) => {
        //     console.log(profile);
		// 	if(profile?.points){
		// 		setMyProfile(profile);
		// 	}else{
        //         setMyProfile(undefined);
        //     }
		// }).catch((error) => {
        //     setMyProfile(undefined);
        // });
    }, [currentAccount]);

	// const setCurr = (addy: string): string => {
    //   Addy = addy;
	//   console.log(Addy);
	//   setCurrentAddy((prev) => addy);
	//   return addy;
    // };

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
				<HandleMultiPlayerCreateGameEvents currentAddy={currentAccount?.address!}></HandleMultiPlayerCreateGameEvents>
				<ConnectButton></ConnectButton>
			</div>
			{/* <div className="find4AnimationContainer" key={"animationContainer"+Date.now()}>
				<Find4Animation size={10} animated={true} />
			</div> */}
			
			{/* {currentAccount ? <div>Auto-connection status: {autoConnectionStatus}</div> : ""} */}
			{/* <br /> My address {currentAccount?.address} */}
			<div className="newButtonsContainer">
				<NewGameButton gameType="single" label="Single Player" disabled={true}></NewGameButton>
				<NewGameButton gameType="multi" label="Multiplayer" disabled={false} trophies={myProfile?.points}></NewGameButton>
			</div>
		</div>
  );
}

export default GameHomeScreen;

