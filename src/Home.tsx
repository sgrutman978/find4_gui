import React, { useState } from 'react';
import Find4Animation from './Find4Animation';
import Presale from './Presale';
import { SuiClientProvider } from '@mysten/dapp-kit';
// import './Navbar.css';
import { getFullnodeUrl, SuiClient, SuiClientOptions, SuiHTTPTransport } from '@mysten/sui/client';
import Staking from './Staking';

// const suiClient = new SuiClient({
// 	url: getFullnodeUrl('mainnet'), // Use 'mainnet' for production
//   });
  
//   const networks = {
// 	testnet: { url: getFullnodeUrl('testnet') },
// 	mainnet: { url: getFullnodeUrl('mainnet') },
//   } satisfies Record<string, SuiClientOptions>;

function Home() {
	// const [activeNetwork, setActiveNetwork] = useState("mainnet" as keyof typeof networks);
  return (
// 	<SuiClientProvider
//     networks={networks}
//     network={activeNetwork}
//     onNetworkChange={(network) => {
//       setActiveNetwork(network as keyof typeof networks);
//     }}
//     // defaultNetwork="devnet"
//     createClient={(network, config) => {
//       return new SuiClient({ url: getFullnodeUrl(network) });
//     }}
//   >
	<div style={{width: "100%", display: 'flex', justifyContent: 'center'}}>
		<div className="homeScreen" style={{marginTop: 70}}>

			{/* <div  className="hs1" id="section1" style={{margin:20}}>
				Join the presale before it's too late!
			</div> */}

			<div className="hs1 section1" style={{marginTop: 11}}>
				The best game on the SUI blockchain! 
				{/* <br /> */}
				{/* Get in early!<br />Help redefine web3 gaming on SUI! */}
				{/* <div className="hs5"> */}
					{/* <div className="animated_home"> */}
						{/* <Find4Animation size={3} animated={true} /> */}

					{/* </div> */}
			</div>
			<div className='hs1 section1'>
			{/* <a style={{color: "yellow"}} href="https://www.pinksale.finance/sui/launchpad/0x4b7d998555d653880111e60321c66e4a7a63c65d615d90cffdd27fce9ff583c8">
				Join the Pinksale Presale!
			</a> */}
			</div>
			<img style={{width:"100%", alignSelf: 'center', borderRadius: 50, marginTop: -15}} src="gameplay.png" />

			{/* <div className='hs1 section1'>
			Join the Presale!
			</div> */}
			{/* <div style={{display: 'flex', justifyContent: 'center', width:"100%"}} id="presale"> */}
				{/* <Presale></Presale> */}
				{/* <Staking></Staking>
			</div> */}

			<div className='hs5' style={{}}><img style={{width:"100%"}} src="playing2.jpeg" /></div>
			<div  className="hs5 section1">
				Play others online to earn trophies!
			</div>

			<div  className="hs5 section1">
				Stake tokens to increase earnings!
			</div>
			<div className='hs5' style={{}}><img style={{width:"100%"}} src="trophy5.jpeg" /></div>

			<div className='hs5' style={{}}><img style={{width:"100%", borderRadius: "50%"}} src="ai.webp" /></div>
			<div  className="hs5 section1">
				Beat the AI to earn tokens!
			</div>
			
			<div style={{borderRadius: 50}} className="hs7 tokenomics section1" id="tokenomics">
				{/* <span>Tokenomics</span> */}
				<img style={{width:"100%", alignSelf: 'center'}} src="chart4.png" />
				{/* <img style={{width:"60%", display: 'flex', marginLeft: -519, marginTop: -49, borderRadius: 120}} src="f4-42.png" /> */}
			</div>

			<div  className="hs7 tokenomics section1">
				<span>Rewards Calculations</span>
				<span style={{fontSize: 25, padding: 30}}>
				<span style={{fontWeight: "bold", fontSize: 30}}>Max Staking Limit</span> = 
				<span> # of Trophies * 1,000</span><br />
				<span style={{fontWeight: "bold", fontSize: 30}}>Reward for Beating the AI</span> = 
				<span> 1 + log2(StakedTokens) + log10(StakedToken)</span>
				</span>
				{/* <img style={{width:"70%", alignSelf: 'center', marginTop: 20}} src="chart2.png" /> */}
				{/* <img style={{width:"60%", display: 'flex', marginLeft: -519, marginTop: -49, borderRadius: 120}} src="f4-42.png" /> */}
			</div>

			<img style={{width:"100%", alignSelf: 'center', borderRadius: 50, marginTop: 20}} src="timeline.png" />

				{/* <div  className="hs5" id="section1">
				Get in early!<br />Help redefine web3 gaming on SUI!
				</div> */}
				{/* <div className="homeScreenSection"> */}
					
				{/* </div> */}
			{/* </div> */}
		</div></div>
		// </SuiClientProvider>
  );
}

export default Home;

