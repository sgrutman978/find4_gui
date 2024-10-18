import React, { ReactNode, useEffect, useState } from 'react';
import NewGameButton from './NewGameButton';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';

function GameHomeScreen() {
	const autoConnectionStatus = useAutoConnectWallet();
	const currentAccount = useCurrentAccount();

	// [l,t,c]
	const pairs = [[0,0,0], [0,1,0], [0,2,0], [0,3,0], [0,4,0], [1,0,0], [1,2,0], [2,0,0], //f
					[3,1,1], [3,3,1], [3,4,1], //i
					[4,2,0], [4,3,0], [4,4,0], [5,2,0], [6,2,0], [6,3,0], [6,4,0], //n
					[7,2,1], [7,3,1], [7,4,1], [8,2,1], [8,4,1], [9,0,1], [9,1,1], [9,2,1], [9,3,1], [9,4,1], //d
					[10,0,0], [10,1,0], [10,2,0], [11,2,0], [12,0,0], [12,1,0], [12,2,0], [12,3,0], [12,4,0], //4
					[13,4,1], //.
					[14,1,0], [14,3,0], [14,4,0], //i
					[15,2,1], [15,3,1], [15,4,1], [16,2,1], [16,4,1], [17,2,1], [17,3,1], [17,4,1] //o
					];
	const [items, setItems] = useState([<></>]);
	const [reset, setReset] = useState(0);
	// let count = 0;

	useEffect(() => {
		// count = count + 1; 
		// if(count%2 == 0){
		// console.log("start");
		let i = 0;
		setItems([]);
		pairs.forEach(([l,t,c]) => {
			setTimeout(() => {
				setItems(prev => [...prev, <div className={"ball " + (!c?"yellow":"red")} style={{left:(10+l*40), top:(10+t*40)}}></div>]);
			}, (i+1)*100);
			i = i + 1;
		});
		let x: JSX.Element[] = [];
			pairs.forEach(([l,t,c]) => {
				x.push(<div className={"ball " + (!c?"yellow":"red")} style={{left:(10+l*40), top:(10+t*40)}}></div>);
		});
		// let y = 0;
			for(let q = 1; q < 11; q=q+1){
				setTimeout(() => {
					setItems((q%2?[]:x));
				}, ((i+1)*100+q*200));
				if(q == 10){
					setTimeout(() => {
						setReset(prev => prev + 1);
					}, (i+1)*100+q*200+5000);
				}
			}
		// setTimeout(() => {
			// i = i + 20;
			
			
			// setInterval(() => {
			// 	if (y < 9){
			// 		setItems((y%2?[]:x));
			// 		y = y + 1;
			// 		// console.log(y);
			// 	// console.log(reset);
			// 	} else if (y == 9) {
			// 		// console.log("yyyyyy");
			// 		y = 10;
			// 		setTimeout(() => {
			// 			setItems(prev => []);
			// 			setReset(prev => prev + 1);
			// 		}, 5000);
					
			// 		// console.log(y);
			// 		// console.log(reset);
			// 	}
			// }, 300);
		// }, i*100);
	// }
	}, [reset])

  return (
		<div className="gameHomeScreen">
			<div className="connectButtonWrapper">
				<ConnectButton></ConnectButton>
			</div>

			<div style={{width:800, height: 300, position: "absolute", left:100, top:10}}>

				{
					items
				}

				{/* F */}
				{/* <div className="ball yellow" style={{left:10, top:10}}></div>
				<div className="ball yellow" style={{left:10, top:50}}></div>
				<div className="ball yellow" style={{left:10, top:90}}></div>
				<div className="ball yellow" style={{left:10, top:130}}></div>
				<div className="ball yellow" style={{left:10, top:170}}></div>

				<div className="ball yellow" style={{left:50, top:10}}></div>
				<div className="ball yellow" style={{left:50, top:90}}></div>

				<div className="ball yellow" style={{left:90, top:10}}></div> */}

				{/* i */}
				{/* <div className="ball red" style={{left:130, top:50}}></div>
				<div className="ball red" style={{left:130, top:130}}></div>
				<div className="ball red" style={{left:130, top:170}}></div> */}
				
				{/* n */}
				{/* <div className="ball yellow" style={{left:170, top:50}}></div> */}
				{/* <div className="ball yellow" style={{left:170, top:90}}></div>
				<div className="ball yellow" style={{left:170, top:130}}></div>
				<div className="ball yellow" style={{left:170, top:170}}></div>
				
				<div className="ball yellow" style={{left:210, top:90}}></div>

				<div className="ball yellow" style={{left:250, top:90}}></div>
				<div className="ball yellow" style={{left:250, top:130}}></div>
				<div className="ball yellow" style={{left:250, top:170}}></div> */}
				
				{/* d */}
				{/* <div className="ball red" style={{left:290, top:90}}></div>
				<div className="ball red" style={{left:290, top:130}}></div>
				<div className="ball red" style={{left:290, top:170}}></div>
				
				<div className="ball red" style={{left:330, top:90}}></div>
				<div className="ball red" style={{left:330, top:170}}></div>

				<div className="ball red" style={{left:370, top:10}}></div>
				<div className="ball red" style={{left:370, top:50}}></div>
				<div className="ball red" style={{left:370, top:90}}></div>
				<div className="ball red" style={{left:370, top:130}}></div>
				<div className="ball red" style={{left:370, top:170}}></div> */}

				{/* . */}
				{/* <div className="ball yellow" style={{left:410, top:170}}></div> */}

				{/* i */}
				{/* <div className="ball red" style={{left:450, top:50}}></div>
				<div className="ball red" style={{left:450, top:130}}></div>
				<div className="ball red" style={{left:450, top:170}}></div> */}

				{/* o */}
				{/* <div className="ball yellow" style={{left:490, top:90}}></div>
				<div className="ball yellow" style={{left:490, top:130}}></div>
				<div className="ball yellow" style={{left:490, top:170}}></div>
				
				<div className="ball yellow" style={{left:530, top:90}}></div>
				<div className="ball yellow" style={{left:530, top:170}}></div>

				<div className="ball yellow" style={{left:570, top:90}}></div>
				<div className="ball yellow" style={{left:570, top:130}}></div>
				<div className="ball yellow" style={{left:570, top:170}}></div> */}

			</div>

			{/* {currentAccount ? <div>Auto-connection status: {autoConnectionStatus}</div> : ""} */}
			{/* <br /> My address {currentAccount?.address} */}
			<div className="newButtonsContainer">
				{/* <NewGameButton label="Single Player"></NewGameButton> */}
				{/* <NewGameButton label="Multiplayer"></NewGameButton> */}
			</div>
		</div>
  );
}

export default GameHomeScreen;

