import React from 'react';
import NewGameButton from './NewGameButton';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { network, programAddress } from './sui_controller';
import Header from './Header';
// import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <a href="/"><h2 className="logo">Connect Four</h2></a>
      <ul className="nav-links">
        <li>
            {/* <BrowserRouter>
				<Routes>
                    <Route path="/"  Component={NewGameButton} />
				</Routes>
            </BrowserRouter> */}
            <NewGameButton></NewGameButton>
            {/* <a href="#play-now"><Play Now></a> */}
        </li>
        <li><a href={`https://${network}.suivision.xyz/package/${programAddress}?tab=Code"`}>{`${programAddress.substring(0, 7)}...${programAddress.slice(-3)}`}</a></li>
        <li><a href="/tokenomics">Tokenomics</a></li>
        <li><Header></Header></li>
      </ul>
    </nav>
  );
}

export default Navbar;