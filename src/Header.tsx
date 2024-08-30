import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
 
function Header() {
  const autoConnectionStatus = useAutoConnectWallet();
	const currentAccount = useCurrentAccount();
 
	return (
		<div style={{ padding: 20 }}>
			<ConnectButton />
			{currentAccount ? <div>Auto-connection status: {autoConnectionStatus}</div> : ""}
			{/* <br /> My address {currentAccount?.address} */}
		</div>
	);
}

export default Header;




