import React from 'react';
import NewGameButton from './NewGameButton';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { myNetwork, programAddress } from './sui_controller';
// import Header from './Header';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';

function Navbar(props: any) {
  return (
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
        <a href="/gameHomeScreen" className='menuElement launchAppButton'>Launch App</a>
          {/* : <ConnectButton></ConnectButton>} */}
        <a href={`https://${myNetwork}.suivision.xyz/package/${programAddress}?tab=Code`} className="menuElement contract">Explorer</a>
        <a href="#tokenomics" className="menuElement">Tokenomics</a>
       

        {/* <ConnectButton></ConnectButton> */}
        {/* <Header></Header> */}
      {/* // </ul> */}
    </nav>
  );
}

export default Navbar;