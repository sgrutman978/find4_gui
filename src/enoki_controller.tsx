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
import { EnokiClient, EnokiFlow } from "@mysten/enoki";
import { useCurrentAccount, useCurrentWallet, useDisconnectWallet, useSignTransaction, useSuiClient } from "@mysten/dapp-kit";
  
  
  export const executeTransactionBlockWithoutSponsorship = async (tx: Transaction, enokiFlow: EnokiFlow, suiClient: SuiClient, callback: (result: any) => void, errorCallback?: (error: any) => void): Promise<SuiTransactionBlockResponse | void> => {
    try{
    console.log("jjjjj");
    // if (!isConnected) {
    //   return;
    // }
    // let tx = new Transaction();
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
    const txBytes = await tx.build({ client: suiClient });
    const signature = await signTransaction(txBytes, enokiFlow);
    return suiClient.executeTransactionBlock({
      transactionBlock: txBytes,
      signature: signature!,
      requestType: "WaitForLocalExecution",
      options: {},
    }).then((result) => {
        callback(result);
        console.log("lllllll");
        console.log(result.digest);
    }).catch(e => {
        if(errorCallback){
            errorCallback(e);
        }
        console.log(e);
    });
}catch (e){
    console.log(e);
}
  };

  const signTransaction = async (bytes: Uint8Array, enokiFlow: EnokiFlow): Promise<string> => {
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