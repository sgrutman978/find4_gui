// import React, { useState } from 'react';
// // import { TransactionBlock, getZkLoginSignature, SuiClient } from '@mysten/sui.js';
// // import { GoogleLogin } from 'react-google-login';
// import axios from 'axios';
// import { Transaction } from '@mysten/sui/dist/cjs/transactions';

// // const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // From Google Cloud Console
// // const SUI_RPC_URL = 'https://fullnode.testnet.sui.io:443'; // Testnet RPC
// // const BACKEND_URL = 'http://localhost:3001'; // Your Node.js server

// import { getFullnodeUrl, PaginatedObjectsResponse, QueryEventsParams, SuiClient,  } from '@mysten/sui/client';

// import * as zk from '@mysten/sui/zklogin';
// import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
// // const FULLNODE_URL = 'https://fullnode.devnet.sui.io'; // replace with the RPC URL you want to use
// const suiClient = new SuiClient({ url: "https://go.getblock.io/2e301c1cd2e542e897c7a14109d81baf" });
// const { epoch, epochDurationMs, epochStartTimestampMs } = await suiClient.getLatestSuiSystemState();

// const maxEpoch = Number(epoch) + 2; // this means the ephemeral key will be active for 2 epochs from now.
// const ephemeralKeyPair = new Ed25519Keypair();
// // const randomness = zk.generateRandomness();
// // const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);
// // zk.


// // const suiClient = new SuiClient({ url: rpc });
// // const REDIRECT_URI = '<YOUR_SITE_URL>';

// const params = new URLSearchParams({
// 	// Configure client ID and redirect URI with an OpenID provider
// 	client_id: "1010386909639-p3bjjhp05pnk5vhsqak41lausgtk75nf.apps.googleusercontent.com",
// 	redirect_uri: "http://localhost:3000",
// 	response_type: 'id_token',
// 	scope: 'openid',
// 	// See below for details about generation of the nonce
// 	// nonce: nonce,
// });

// const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

// window.location.href = loginURL;

function ZKLogin() {
//   const [address, setAddress] = useState(null);
//   const [jwt, setJwt] = useState(null);
//   const [position, setPosition] = useState('');
//   const [gameId, setGameId] = useState('YOUR_KIOSK_OBJECT_ID'); // Replace with actual kiosk ID

//   // Handle Google login success
//   const handleLoginSuccess = async (response) => {
//     const idToken = response.tokenId;

//     // Request zkLogin proof from backend
//     const { data } = await axios.post(`${BACKEND_URL}/auth/zklogin`, { jwt: idToken });
//     setJwt(idToken);
//     setAddress(data.address);

//     console.log('Logged in with address:', data.address);
//   };

//   // Submit a move
//   const submitMove = async () => {
//     if (!address || !jwt) {
//       alert('Please log in first!');
//       return;
//     }

//     // Construct PTB for the move
//     const txb = new Transaction();
//     txb.moveCall({
//       target: '0xYOUR_PACKAGE_ID::game::make_move', // Replace with your package ID
//       arguments: [
//         txb.object(gameId), // Kiosk object ID
//         txb.object('0xYOUR_KIOSK_OWNER_CAP_ID'), // Replace with cap ID
//         txb.pure(position), // Position (0-8)
//         txb.pure(0), // Turn nonce (fetch from backend/game state in practice)
//         txb.object('0xSUI_COIN_OBJECT_ID'), // Replace with a Coin<SUI> object ID from player's wallet
//       ],
//     });

//     // Request ephemeral keypair and proof from backend
//     const { data } = await axios.post(`${BACKEND_URL}/sign/move`, {
//       jwt,
//       txb: txb.serialize(), // Serialize PTB for signing
//     });

//     const { ephemeralKeyPair, zkProof } = data;

//     // Sign and execute transaction with zkLogin
//     const signature = getZkLoginSignature({
//       jwt,
//       ephemeralKeyPair,
//       userSalt: 'YOUR_USER_SALT', // Replace with a persistent salt per user
//       zkProof,
//     });

//     const result = await suiClient.executeTransactionBlock({
//       transactionBlock: txb,
//       signature,
//       options: { showEffects: true },
//     });

//     console.log('Move submitted:', result);
//   };

//   return (
//     <div>
//       <h1>Tic-Tac-Toe on Sui</h1>
//       {!address ? (
//         <GoogleLogin
//           clientId={CLIENT_ID}
//           buttonText="Login with Google"
//           onSuccess={handleLoginSuccess}
//           onFailure={(err) => console.error('Login failed:', err)}
//         />
//       ) : (
//         <div>
//           <p>Logged in as: {address}</p>
//           <input
//             type="number"
//             min="0"
//             max="8"
//             value={position}
//             onChange={(e) => setPosition(e.target.value)}
//             placeholder="Enter position (0-8)"
//           />
//           <button onClick={submitMove}>Submit Move</button>
//         </div>
//       )}
//     </div>
//   );
}

export default ZKLogin;