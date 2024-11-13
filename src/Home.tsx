import React from 'react';
import Find4Animation from './Find4Animation';
// import './Navbar.css';

function Home() {
  return (
		<div className="homeScreen">
			<div style={{marginTop: 70}} className="homeScreenSection">
				<div className="section">
					<div className="animated_home">
						<Find4Animation size={13} animated={true} />
					</div>
				</div>
				<div className="section">
					
				</div>
			</div>
			<div className="homeScreenSection">
				
			</div>
		</div>
  );
}

export default Home;

