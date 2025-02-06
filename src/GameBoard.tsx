import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { fetchEvents, /*fetchProfile,*/ GetObjectContents, /*GetProfile,*/ myNetwork, player_move, player_win } from './sui_controller';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import Find4Animation from './Find4Animation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Transaction } from '@mysten/sui/dist/cjs/transactions';
import { getProfileFromServer, getWhoTurn } from './ServerConn';

export interface Profile {
    profilePicUrl?: string,
    username?: string,
    points?: number
  };

export interface GameStats {
    current_player: number,
    p1_addy: string,
    p2_addy: string,
    gameType: string,
    gameOver: boolean,
    winnerInt: number,
    myTurn: boolean,
    version: string,
    board: string[][]
}

function GameBoard() {

    const [gameStats, setGameStats] = useState(({} as GameStats));
    let [key, setKey] = useState(0);
    // let [timer, setTimer] = useState(20);
    const [profile1, setProfile1] = useState<Profile>({username: "User", points: 69, profilePicUrl: "../../f4-42.png"});
    const [profile2, setProfile2] = useState<Profile>({username: "AI", points: 69, profilePicUrl: "../../ai.webp"});
    // const [pingGame, setPingGame] = useState(false);
    const [oldCounter, setOldCounter] = useState(0);
    const [previousTurn, setPreviousTurn] = useState(0);
    
    // useEffect(() => {
    //     // console.log(gameStats.myTurn);
    //     // console.log(pingGame);
    //     // console.log(key);
    //     if(key == 0 || !gameStats.gameOver){
    //     // if(key == 0 || !gameStats.gameOver){
    //     // if((!pingGame || key == 0) && !gameStats.gameOver){
    //         // console.log("grab game");
    //         console.log(gameID!);
            
            
    //     }
    // }, [key]);

    // useEffect(() => {
    //     setInterval(() => {
    //         setTimer(prev => prev - 1);
    //     }, 3000);
    // }, []);

    const pullGameStatsFromChain = () => {
        console.log("gettingGame");
        GetObjectContents(gameID!).then((data) => {
            const current_player = data.version ? data.data["current_player"] : -1;
            const p1_addy = data.version ? data.data["p1"] : "";
            const p2_addy = data.version ? data.data["p2"] : "";
            const winnerInt = data.version && data.data["winner"];
            const myTurn = ((currentAccount?.address == p1_addy && current_player == 1) || (currentAccount?.address == p2_addy && current_player == 2));
            const board = data.data["board"];
            const gameType = data.version && data.data["gameType"] == 1 ? "single" : "multi";
            setGameStats({
                current_player: current_player,
                p1_addy: p1_addy,
                p2_addy: p2_addy,
                gameType: gameType,
                gameOver: data.version && data.data["is_game_over"],
                winnerInt: winnerInt,
                version: data.version && data.version != "" ? (data.version as any).Shared.initial_shared_version : "0",
                myTurn: myTurn,
                board: board
            });


            let counter = 0;
                for(let c = 5; c >= 0; c--){
                    for (let r = 0; r < 7; r++) {
                        const color = (p1_addy != "" &&  board ? board[c][r] : "");
                        if(color != "" && color != "0"){
                            counter = counter + 1;
                        }
                    }
                }
                // console.log(counter);
                // console.log(oldCounter);
                if(counter > oldCounter && currentAccount?.address){
                    // console.log("pppppppppppppppppp");
                    // console.log(myTurn);
                    // console.log(p1_addy);
                    // console.log(currentAccount?.address);
                    setOldCounter(counter);
                    // setPingGame(myTurn);
                }


            if(key == 0){
                // setPingGame(myTurn);
                getProfileFromServer(data.data["p1"]).then((profile) => {
                    setProfile1(profile);
                });
                if(gameType == "multi"){
                    getProfileFromServer(data.data["p2"]).then((profile) => {
                        setProfile2(profile);
                    });
                }
                setKey(prev => 555);
            }
        });
    };

    
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currentAccount = useCurrentAccount();
    const { gameID } = useParams();
    const amIWinner = gameStats.version && ((gameStats.winnerInt == 1 && currentAccount?.address == gameStats.p1_addy) || (gameStats.winnerInt == 2 && currentAccount?.address == gameStats.p2_addy))

    // console.log(winner);

    function useInterval(callback: () => void, delay: number | null) {
        useEffect(() => {
          if (delay !== null) {
            const intervalId = setInterval(callback, delay);
            return () => clearInterval(intervalId);
          }
        }, [callback, delay]);
      }

    // useEffect(()=>{
        // runUpdateBoardInterval();
        // setInterval(() => {
            
        // }, 2000);
        
    // },[])   

    const intervalCallback = () => {
        getWhoTurn(gameID!).then((newTurn) => {
            console.log(newTurn);
            console.log(previousTurn);
            if (newTurn != previousTurn){
                pullGameStatsFromChain();
                setPreviousTurn(newTurn);
                console.log("hahahahha");
                console.log(previousTurn);
            }
        }).catch(e => {
            console.log(e);
        });
    }

    useInterval(intervalCallback, 1000);
    
    // useEffect(()=>{
    //     setPingGame(gameStats.myTurn);
    // },[currentAccount])   

    const sendPlayerMoveTransaction = (column: number) => {
        let transaction = player_move(gameID!, column, gameStats.version, gameStats.gameType);
		doTransaction(transaction, true);			
    };

    const sendWinTransaction = () => {
        player_win(gameID!, gameStats.version, gameStats.gameType).then((tx) => {
            console.log(tx);
            doTransaction(tx, false);	
        });	
    };

    const doTransaction = (transaction: Transaction, isMove: boolean) => {
        signAndExecuteTransaction({
			transaction: transaction!,
			chain: `sui:${myNetwork}`,
		}, {
		    onSuccess: (result) => {
				console.log('executed transaction', result);
                console.log("111111111");
                if(isMove){
                    console.log("setttttttttt");
                    // setPingGame(false);
                    // pullGameStatsFromChain();
                    setPreviousTurn(0);
                }
                // getUpdatedBoard();
			},
            onError: (error) => {
                console.log(error);
            }
		});	
    };

    // const runUpdateBoardInterval = () => {
    //     clearInterval(interval);
    //     interval = setInterval(() => {
    //         setKey(prevKey => prevKey + 1);
    //     }, 1800);
    // };

    const displayRows = (key: number) => {
        const board = [];
        if(gameStats.version && gameStats.version != ""){
            for(let c = 5; c >= 0; c--){
                const row = [];
                for (let r = 0; r < 7; r++) {
                    const color = (gameStats.version != "" &&  gameStats.board ? gameStats.board[c][r] : "");
                    row.push(<div className={"gamespace spaceColor"+color} key={`${c*c}${r*r}`}>
                        <div className={"gamespaceCover spaceCover"+color} key={`${c*c}${r*r}`}></div>
                    </div>);
                }
                // board.push(<br />)
                board.push(row);
            }
            return board;
        }
    };

    const shorten_addy = (input: string) => {
        if(!input) return "";
        const firstPart = input.slice(0, 5);
        const lastPart = input.slice(-5);
        return `${firstPart}...${lastPart}`;
    }

    // If its my turn based who went first and the status, determine which type of transaction based on status
        return (<>
        <div className="connectButtonWrapper">
                    <ConnectButton></ConnectButton>
			    </div>

                <div className="logo_gameboard">
                        {/* <Find4Animation size={3} animated={false} /> */}
                        <a href="/app" className="logo" style={{marginLeft:0,marginTop:0, fontSize:60}}>
                        <img src="../../logo.png" style={{height: "100%"}} />
                        </a>
     
                </div>
                
                <div id="gbbc">
                {/* <div className="profileContainer"> */}
                        <div className="profileSmaller">
                        <span className="profilePointsSmall"><FontAwesomeIcon icon={faTrophy} /> {profile1.points}</span>
                            <img className="profilePicSmall yellowBorder" src={profile1.profilePicUrl} />
                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: "center"}}>
                                <span className="profileUsernameSmall">{profile1.username}</span>
                                <span className="profileAddySmall">{shorten_addy(gameStats.p1_addy)}</span>
                            </div>
                            {/* <div className="profileGamespaceSmall" style={{backgroundColor: "yellow"}}>
                                <div className="gamespaceCover spaceCover1"></div>
                            </div> */}
                        </div>
                {/* </div> */}
            <div id="gameboard-body">
                <div className="profileContainer">
                        <div className="anotherOne">
                            <span className="profilePoints"><FontAwesomeIcon icon={faTrophy} /> {profile1.points}</span>
                            <img className="profilePic" src={profile1.profilePicUrl} />
                            <span className="profileUsername">{profile1.username}</span>
                            <span className="profileAddy">{shorten_addy(gameStats.p1_addy)}</span>
                            <div className="profileGamespace" style={{backgroundColor: "yellow"}}>
                                <div className="gamespaceCover spaceCover1"></div>
                            </div>
                        </div>
                </div>
                
                <div id="gameboard">
                {displayRows(key)}
                {gameStats.myTurn ? <div className="selectColumnContainer">
                    <button className="selectColumn" style={{marginLeft: 0}} onClick={() => {sendPlayerMoveTransaction(0)}}></button>
                    <button className="selectColumn" onClick={() => {sendPlayerMoveTransaction(1)}}></button>
                    <button className="selectColumn" onClick={() => {sendPlayerMoveTransaction(2)}}></button>
                    <button className="selectColumn" onClick={() => {sendPlayerMoveTransaction(3)}}></button>
                    <button className="selectColumn" onClick={() => {sendPlayerMoveTransaction(4)}}></button>
                    <button className="selectColumn" onClick={() => {sendPlayerMoveTransaction(5)}}></button>
                    <button className="selectColumn" onClick={() => {sendPlayerMoveTransaction(6)}}></button>
                </div> : <></>}
                </div>

                <div className="profileContainer">
                        <div className="anotherOne">
                            <span className="profilePoints"><FontAwesomeIcon icon={faTrophy} /> {profile2.points}</span>
                            <img className="profilePic" src={profile2.profilePicUrl} />
                            <span className="profileUsername">{profile2.username}</span>
                            <span className="profileAddy">{shorten_addy(gameStats.p2_addy)}</span>
                            <div className="profileGamespace" style={{backgroundColor: "red"}}>
                                <div className="gamespaceCover spaceCover2"></div>
                            </div>
                        </div>
                </div>

                </div>

                <div className="profileSmaller">
                        <span className="profilePointsSmall"><FontAwesomeIcon icon={faTrophy} /> {profile2.points}</span>
                            <img className="profilePicSmall redBorder" src={profile2.profilePicUrl} />
                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: "center"}}>
                                <span className="profileUsernameSmall">{profile2.username}</span>
                                <span className="profileAddySmall">{shorten_addy(gameStats.p2_addy)}</span>
                            </div>
                            {/* <div className="profileGamespaceSmall" style={{backgroundColor: "yellow"}}>
                                <div className="gamespaceCover spaceCover1"></div>
                            </div> */}
                        </div>

                {currentAccount && gameStats.gameOver ? 
                <div className="winnerLoserDiv">
                    {amIWinner ? <>
                    Winner
                    <div style={{flexGrow: 1, display: 'flex', flexDirection: 'row', gap: '2vw'}}>
                        <button className="winButton" style={{flexGrow: 2}} onClick={() => sendWinTransaction()}>Collect Reward</button>
                        <button className="winButton lightRed" style={{flexGrow: 1}} onClick={() => window.location.href = '/app'}>Return Home</button>
                    </div></>: <>
                    Loser
                    <button className="winButton lightRed" onClick={() => window.location.href = '/app'}>Return Home</button>
                    </>}
                </div> : <></>}
            </div>
            </>
        );

//   return (<></>);
}

export default GameBoard;
