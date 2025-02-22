import React, { useState, useEffect } from 'react';
import { Transaction } from '@mysten/sui/transactions';
// import { useSuiClient } from '@mysten/dapp-kit';
import { useEnokiFlow } from '@mysten/enoki/react';
import {getFullnodeUrl, SuiClient} from '@mysten/sui/client';
import {
    SuiTransactionBlockResponse,
    SuiTransactionBlockResponseOptions,
  } from "@mysten/sui/client";
// import serverConfig from "@/config/serverConfig";
import { EnokiClient } from "@mysten/enoki";
import { useCurrentAccount, useCurrentWallet, useDisconnectWallet, useSignTransaction, useSuiClient } from "@mysten/dapp-kit";

const ENOKI_SECRET_KEY = "enoki_public_10094b0bafc9ba2626fcbc02a1812d6b";

export const enokiClient = new EnokiClient({
  apiKey: ENOKI_SECRET_KEY,
});

interface SponsorAndExecuteTransactionBlockProps {
    tx: Transaction;
    network: "mainnet" | "testnet";
    options: SuiTransactionBlockResponseOptions;
    includesTransferTx: boolean;
    allowedAddresses?: string[];
  }
  
  interface ExecuteTransactionBlockWithoutSponsorshipProps {
    tx: Transaction;
    options: SuiTransactionBlockResponseOptions;
  }
 
function Demo() {
    // const  isConnected  = useCurrentWallet();
    // const { mutateAsync: signTransactionBlock } = useSignTransaction();
    const [loggedIn, setLoggedIn] = useState<string | null>(null);
	// const client = useSuiClient();
    const client = new SuiClient({ url: getFullnodeUrl("mainnet") });
    const enokiFlow = useEnokiFlow();
	// const enokiFlow = useEnokiFlow();
 
	// async function handleButtonClick() {
	// 	// Get the keypair for the current user.
	// 	const keypair = await enokiFlow.getKeypair();
 
	// 	const tx = new Transaction();
	// 	// Add some transactions to the block...
 
	// 	// Sign and execute the transaction, using the Enoki keypair
	// 	await client.signAndExecuteTransaction({
	// 		signer: keypair,
	// 		transaction: tx,
	// 	});
	// }
 
	function checkPathname(url: string, targetPathname: string): boolean {
        try {
          const urlObject = new URL(url);
          return urlObject.pathname === targetPathname;
        } catch (error) {
          return false; // Invalid URL
        }
      }

    


    useEffect(() => {
        console.log(window.location.pathname);
        if(window.location.pathname == "/login_redirect"){
            enokiFlow.handleAuthCallback().then(() => {
                window.location.href = "/";
            });
        }
        enokiFlow.$zkLoginState.subscribe((state) => {
            setLoggedIn(state?.address!);
            console.log(state);
        });
    }, []);
  


	const handleSignInOut = () => {
        if(!loggedIn){
		const protocol = window.location.protocol;
		const host = window.location.host;
		// Set the redirect URL to the location that should
		// handle authorization callbacks in your app
		const redirectUrl = "http://localhost:3000/login_redirect"; //`${protocol}//${host}/auth`;
 
		enokiFlow
			.createAuthorizationURL({
				provider: 'google',
				network: 'mainnet',
				clientId: "1010386909639-p3bjjhp05pnk5vhsqak41lausgtk75nf.apps.googleusercontent.com",
				redirectUrl,
				extraParams: {
					scope: ['openid', 'email', 'profile'],
				},
			})
			.then((url) => {
				window.location.href = url;
			})
			.catch((error) => {
				console.error(error);
			});
        }else{
            enokiFlow.logout();
        }
	};

    const signTransaction = async (bytes: Uint8Array): Promise<string> => {
        // if (isUsingEnoki) {
          const signer = await enokiFlow.getKeypair({
            network: "mainnet",
          });
          const signature = await signer.signTransaction(bytes);
          return signature.signature;
        // }
        // const txBlock = Transaction.from(bytes);
        // return signTransactionBlock({
        //   transaction: txBlock,
        //   chain: `sui:${"mainnet"}`,
        // }).then((resp) => resp.signature);
      };

    
        const executeTransactionBlockWithoutSponsorship = async (): Promise<SuiTransactionBlockResponse | void> => {
            console.log("jjjjj");
            // if (!isConnected) {
            //   return;
            // }
            let tx = new Transaction();
            const signer = await enokiFlow.getKeypair({
                network: "mainnet",
              });
            tx.setSender(signer.toSuiAddress());
            console.log(signer.toSuiAddress());
            // tx.setGasPrice(5000000000);
                 tx.moveCall({
                      target: '0x2::clock::timestamp_ms', // Replace with your package ID
                      arguments: [
                        tx.object("0x6"), // Kiosk object ID
                       ],
                    });
            const txBytes = await tx.build({ client: client });
            const signature = await signTransaction(txBytes);
            return client.executeTransactionBlock({
              transactionBlock: txBytes,
              signature: signature!,
              requestType: "WaitForLocalExecution",
              options: {},
            });
          };

    return (<div><button onClick={handleSignInOut}>{loggedIn ? "Sign out" : "Sign in"}</button>
    <button onClick={() => executeTransactionBlockWithoutSponsorship()}>Sign transaction</button></div>);

}

export default Demo;