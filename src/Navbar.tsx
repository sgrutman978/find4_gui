import React, { useEffect, useState } from 'react';
import NewGameButton from './NewGameButton';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { myNetwork, programAddress } from './sui_controller';
// import Header from './Header';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import Find4Animation from './Find4Animation';

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
      { name: 'Home', link: '#' },
      { name: 'About', link: '#' },
      { name: 'Contact', link: '#' }
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
        <a href="/app" className='menuElement launchAppButton'>Launch App</a>
          {/* : <ConnectButton></ConnectButton>} */}
        <a href={`https://${myNetwork}.suivision.xyz/package/${programAddress}?tab=Code`} className="menuElement contract">Explorer</a>
        <a href="#tokenomics" className="menuElement">Tokenomics</a>
        <a href="#presale" className="menuElement">Presale</a>
       

        {/* <ConnectButton></ConnectButton> */}
        {/* <Header></Header> */}
      {/* // </ul> */}

    </nav>
  );
}

export default Navbar;