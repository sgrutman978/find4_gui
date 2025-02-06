import React, { useEffect, useState } from 'react';
import NewGameButton from './NewGameButton';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { myNetwork, programAddress } from './sui_controller';
// import Header from './Header';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import Find4Animation from './Find4Animation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

function Navbar(props: any) {

  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Function to check screen width
  const checkScreenWidth = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  // Add event listener for screen resize
  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

    // Menu items for demonstration
    const menuItems = [
      { name: 'Staking', link: "/staking" },
      { name: 'Play Game', link: '/app' }
    ];

  return isMobile ? 
   (
    <nav className="main-nav">
      <div className={`menu-toggle ${isOpen ? 'change' : ''}`} onClick={toggleMenu}>
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
      </div>
      <a href="/" className="logo logoMobile"><span style={{position: "relative", bottom: 14}}>Find</span><img src="../f4-42.png" style={{width: 50, height: 50, marginLeft: 3, bottom: 4, position: "relative"}} /><span style={{position: "relative", bottom: 13}}>.io</span></a>
      
      <div className={`menu-popup ${isOpen ? 'open' : ''}`}>
            <ul>
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a href={item.link}>{item.name}</a>
                </li>
              ))}
              <li>
                <div className="socialsMobileContainer">
                  <a href="https://x.com/Find4_io" target="_blank"><FontAwesomeIcon icon={faXTwitter} /></a>
                  <a href="https://discord.com/invite/pYsHzwZ82S" target="_blank"><FontAwesomeIcon icon={faDiscord} /></a>
                  <a href={`https://${myNetwork}.suivision.xyz/package/${programAddress}?tab=Code`} target="_blank"><FontAwesomeIcon icon={faGlobe} /></a>
                </div>
              </li>
            </ul>
          </div>
  </nav>
  ) : 
   (
    <nav className="navbar">
      <a href="/" className="logo"><span style={{position: "relative", bottom: 14}}>Find</span><img src="../f4-42.png" style={{width: 50, height: 50, marginLeft: 3, bottom: 4, position: "relative"}} /><span style={{position: "relative", bottom: 13}}>.io</span></a>
      {/* <ul className="nav-links"> */}
        {/* <li> */}
            {/* <BrowserRouter>
				<Routes>
                    <Route path="/"  Component={NewGameButton} />
				</Routes>
            </BrowserRouter> */}
            
            {/* <a href="#play-now"><Play Now></a> */}
        {/* </li> */}
        {/* {window.location.pathname == "/" ?  */}
        {/* <Find4Animation size={15} animated={true} /> */}
        <a href="/app" className='menuElement launchAppButton'>Play Game</a>
          {/* : <ConnectButton></ConnectButton>} */}
          <a href="https://x.com/Find4_io" className="menuElement noDecs" target="_blank"><FontAwesomeIcon icon={faXTwitter} /></a>
          <a href="https://discord.com/invite/pYsHzwZ82S" className="menuElement noDecs" target="_blank"><FontAwesomeIcon icon={faDiscord} /></a>
        <a href={`https://suivision.xyz/coin/0xd9fc80a30c89489764bc07f557dc17162a477d34a9b44e65aae48af8ead006e7::FFIO::FFIO?tab=Trades`} className="menuElement contract"><FontAwesomeIcon icon={faGlobe} /></a>
        {/* <div className="gameHomeFooter"> */}
				{/* </div> */}
        <a href="/staking" className="menuElement">Staking</a>
        {/* <a href="#presale" className="menuElement">Presale</a> */}

			
       

        {/* <ConnectButton></ConnectButton> */}
        {/* <Header></Header> */}
      {/* // </ul> */}

    </nav>
  );
}

export default Navbar;