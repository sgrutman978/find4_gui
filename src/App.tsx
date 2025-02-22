import React, { useState } from 'react';
import './App.css';
import Home from './Home';
import '@mysten/dapp-kit/dist/index.css';
import { Router , Route, BrowserRouter, Routes } from "react-router-dom";
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient, SuiClientOptions, SuiHTTPTransport } from '@mysten/sui/client';
import { ConnectButton } from '@mysten/dapp-kit'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GameBoard from './GameBoard';
// import Header from './Header';
import Navbar from './Navbar';
import GameHomeScreen from './GameHomeScreen';
import { myNetwork } from './sui_controller';
import Presale from './Presale';
import Staking from './Staking';
import Leaderboard from './Leaderboard';
import { EnokiFlowProvider } from '@mysten/enoki/react';
import Enoki from './enoki';
// import { useLocation } from 'react-router-dom';

// Config options for the networks you want to connect to
const networks = {
	testnet: { url: getFullnodeUrl('testnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
} satisfies Record<string, SuiClientOptions>;
const queryClient = new QueryClient();
 
function App() {
	const [activeNetwork, setActiveNetwork] = useState(myNetwork as keyof typeof networks);
	// const location = useLocation();
	return (
		<SuiClientProvider
			networks={networks}
			network={activeNetwork}
			onNetworkChange={(network) => {
				setActiveNetwork(network as keyof typeof networks);
			}}
      // defaultNetwork="devnet"
			createClient={(network, config) => {
        return new SuiClient({ url: getFullnodeUrl(network) });
			}}
		>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      
      <QueryClientProvider client={queryClient}>
        <WalletProvider autoConnect>
		<EnokiFlowProvider apiKey="enoki_public_10094b0bafc9ba2626fcbc02a1812d6b">
          <div className="App">
		  {window.location.pathname == "/" || window.location.pathname == "/staking" ? <Navbar /> : ""}
		  {/* <Navbar /> */}
			<Enoki />
			{/* </Header> */}
			<BrowserRouter>
				<Routes>
                    <Route path="/"  Component={Home} />
					<Route path="/app" Component={GameHomeScreen}/>
                    <Route path="/app/game/:gameID" Component={GameBoard}/>
					{/* <Route path="/presale" Component={Presale}/> */}
					<Route path="/staking" Component={StakingHome}/>
					<Route path="/leaderboard" Component={Leaderboard}/>
				</Routes>
            </BrowserRouter>
          </div>
		  </EnokiFlowProvider>
         </WalletProvider>
      </QueryClientProvider>
      
		</SuiClientProvider>
	);
}

export default App;

function StakingHome(){
	return <div style={{position:"relative", top: 120}}><Staking /></div>;
}
