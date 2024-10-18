import React from 'react';
import NewGameButton from './NewGameButton';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { network, programAddress } from './sui_controller';
// import Header from './Header';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';

function Navbar(props: any) {
  return (
    <nav className="navbar">
      <a href="/" className="logo">Connect Four</a>
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
        <a href={`https://${network}.suivision.xyz/package/${programAddress}?tab=Code`} className="menuElement contract">Explorer</a>
        <a href="#tokenomics" className="menuElement">Tokenomics</a>
       

        {/* <ConnectButton></ConnectButton> */}
        {/* <Header></Header> */}
      {/* // </ul> */}
    </nav>
  );
}

export default Navbar;