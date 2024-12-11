import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { newMultiPlayerGameTx, fetchEvents, myNetwork, newSinglePlayerGameTx, /*fetchProfile,*/ create_or_edit_profile } from './sui_controller';
// import { ExtendedProfile } from './GameBoard';
 
 function HandleMultiPlayerCreateGameEvents(props: any) {

    let intervalCount = 0;

    // useEffect(() => {
	// 	getGameCreationEvents();
	// }, []);

    useEffect(() => { 
        // // console.log("havana");
        // if(props.currentAddy && props.currentAddy != "") {
        //     // setCurrentAccount(() => props.currentAddy);
        //     getEvents();
        // }
        
        const intervalId = setInterval(() => {
            getGameCreationEvents();
            console.log('Interval running...'+props.currentAddy);
          }, 1000);
      
          return () => clearInterval(intervalId); // Cleanup on state change or unmount
        
        
    }, [props.currentAddy]);

	const getGameCreationEvents = () => {
		// currentAccount = useCurrentAccount();
		// console.log(currentAccount);
        // console.log(props.currentAddy);
		// console.log(currentAccount);
		fetchEvents().then((events) => {
			events?.forEach((event) => {
				if(event.type == process.env.REACT_APP_ORIGINAL_ADDRESS_FOR_EVENT_AND_OBJECT_TYPE+"::multi_player::PairingEvent" || event.type == process.env.REACT_APP_ORIGINAL_ADDRESS_FOR_EVENT_AND_OBJECT_TYPE+"::single_player::SinglePlayerGameStartedEvent"){
					let eventData = event.parsedJson as any;
					let x = (Date.now() - Number(event.timestampMs)) < 20000;
					// console.log(currentAccount);
					if (x && (eventData.p1 == props.currentAddy || eventData.p2 == props.currentAddy)){
						//redirect to game page the event described
						window.location.href = '/app/game/'+eventData.game;
					}
			}
			});
		});
        // setTimeout(() => {
        //     getGameCreationEvents();
        // }, 3000);
	};

    // const getEvents = () => {
    //     intervalCount = intervalCount + 1;
    //     const count = intervalCount;
    //     const interval = setInterval(() => {
	// 		// console.log(currentAccount);
    //         // console.log(props.currentAddy);
    //         if(count == intervalCount){
	// 		    getGameCreationEvents(props.currentAddy);
    //         }else{
    //             clearInterval(interval);
    //         }
    //         // console.log("jjdjdjdjdjdjdjdjdjdjdjdjdjdjdj");
    //         // setKey(prevKey => prevKey + 1);
    //     }, 3000);
    // };

    return (<></>)
 }

export default HandleMultiPlayerCreateGameEvents;
