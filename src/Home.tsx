import React from 'react';
import Find4Animation from './Find4Animation';
import Presale from './Presale';
// import './Navbar.css';

function Home() {
  return (
		<div className="homeScreen" style={{marginTop: 70}}>

			{/* <div  className="hs1" id="section1" style={{margin:20}}>
				Join the presale before it's too late!
			</div> */}

			<div  className="hs5" id="section1">
				The best game on the SUI blockchain! Join the Presale!
				{/* Get in early!<br />Help redefine web3 gaming on SUI! */}
				{/* <div className="hs5"> */}
					{/* <div className="animated_home"> */}
						{/* <Find4Animation size={3} animated={true} /> */}

					{/* </div> */}
			</div>
				<Presale></Presale>

			<div className='hs5' style={{}}><img style={{width:"100%"}} src="playing2.jpeg" /></div>
			<div  className="hs5" id="section1">
				Play others online to earn trophies and prestige!
			</div>

			<div  className="hs5" id="section1">
				Stake tokens! The more trophies, the more you can stake!
			</div>
			<div className='hs5' style={{}}><img style={{width:"100%"}} src="trophy5.jpeg" /></div>

			<div className='hs5' style={{}}><img style={{width:"100%"}} src="ai.jpeg" /></div>
			<div  className="hs5" id="section1">
				Beat the AI to earn tokens!
			</div>

			
			<div  className="hs7 tokenomics" id="section1">
				<span>Tokenomics</span>
				<img style={{width:"60%", alignSelf: 'center', marginTop: 20}} src="chart2.png" />
				{/* <img style={{width:"60%", display: 'flex', marginLeft: -519, marginTop: -49, borderRadius: 120}} src="f4-42.png" /> */}
			</div>

				{/* <div  className="hs5" id="section1">
				Get in early!<br />Help redefine web3 gaming on SUI!
				</div> */}
				{/* <div className="homeScreenSection"> */}
					
				{/* </div> */}
			{/* </div> */}
		</div>
  );
}

export default Home;

