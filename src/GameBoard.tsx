import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { GetObjectContents, player_move } from './sui_controller';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';

function GameBoard() {

    const [gameStats, setGameStats] = useState(({} as any));
    let [key, setKey] = useState(0);
    
    useEffect(() => {
        GetObjectContents(gameID!).then((data) => {
            setGameStats(data);
        });
    }, [key])

    
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currentAccount = useCurrentAccount();
    const { gameID } = useParams();
    let version: string;
    let myTurn = false;
    version = gameStats.version && gameStats.version != "" ? (gameStats.version as any).Shared.initial_shared_version : "0";
    const current_player = gameStats.version ? gameStats.data["current_player"]: -1;
    const p1_addy = gameStats.version ? gameStats.data["p1"]: "";
    const p2_addy = gameStats.version ? gameStats.data["p2"]: "";
    myTurn = ((currentAccount?.address == p1_addy && current_player == 1) || (currentAccount?.address == p2_addy && current_player == 2));

    useEffect(()=>{},[key]) 

    const sendTransaction = (column: number) => {
        let transaction = player_move(gameID!, column, version);
		signAndExecuteTransaction({
			transaction: transaction!,
			chain: 'sui:devnet',
		}, {
		    onSuccess: (result) => {
				console.log('executed transaction', result);
                setTimeout(() => {
                    setKey(prevKey => prevKey + 1);
                }, 1000);
			},
		});				
    };

    const displayRows = (key: number) => {
        const board = [];
        if(gameStats.version && gameStats.version != ""){
            for(let c = 5; c >= 0; c--){
                const row = [];
                for (let r = 0; r < 7; r++) {
                    const color = (gameStats.version != "" &&  gameStats.data["board"]? gameStats.data["board"][c][r] : "");
                    row.push(<div className={"gamespace spaceColor"+color}></div>);
                }
                board.push(row);
            }
            return board;
        }
    };

    // If its my turn based who went first and the status, determine which type of transaction based on status
        return (
            <div id="gameboard">
            {displayRows(key)}
            {myTurn ? <>
                <button className="selectColumn" style={{left: "7px"}} onClick={() => {sendTransaction(0)}}>0</button>
                <button className="selectColumn" style={{left: "121px"}} onClick={() => {sendTransaction(1)}}>1</button>
                <button className="selectColumn" style={{left: "235px"}} onClick={() => {sendTransaction(2)}}>2</button>
                <button className="selectColumn" style={{left: "349px"}} onClick={() => {sendTransaction(3)}}>3</button>
                <button className="selectColumn" style={{left: "463px"}} onClick={() => {sendTransaction(4)}}>4</button>
                <button className="selectColumn" style={{left: "577px"}} onClick={() => {sendTransaction(5)}}>5</button>
                <button className="selectColumn" style={{left: "691px"}} onClick={() => {sendTransaction(6)}}>6</button>
            </> : <></>}
            </div>
        );

  return (<></>);
}

export default GameBoard;
