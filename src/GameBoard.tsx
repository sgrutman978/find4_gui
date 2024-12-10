import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { fetchEvents, fetchProfile, GetObjectContents, myNetwork, player_move, player_win } from './sui_controller';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import Find4Animation from './Find4Animation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Transaction } from '@mysten/sui/dist/cjs/transactions';

export interface ExtendedProfile {
    profilePicUrl?: string,
    username?: string,
    points?: number,
    pointsAddy?: string,
    id?: string
  };

function GameBoard() {

    const [gameStats, setGameStats] = useState(({} as any));
    let [key, setKey] = useState(0);
    let [timer, setTimer] = useState(20);
    const [profile1, setProfile1] = useState<ExtendedProfile>({username: "User", points: 69, profilePicUrl: "../../f4-42.png"});
    const [profile2, setProfile2] = useState<ExtendedProfile>({username: "AI", points: 69, profilePicUrl: "../../ai.webp"});
    
    useEffect(() => {
        GetObjectContents(gameID!).then((data) => {
            setGameStats(data);
        });
        console.log(key);
    }, [key]);

    useEffect(() => {
        setInterval(() => {
            setTimer(prev => prev - 1);
        }, 3000);
    }, []);

    let interval = setInterval(() => {}, 50000);

    
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currentAccount = useCurrentAccount();
    // console.log("owned objects");
    const { gameID } = useParams();
    let version: string;
    let myTurn = false;
    version = gameStats.version && gameStats.version != "" ? (gameStats.version as any).Shared.initial_shared_version : "0";
    const current_player = gameStats.version ? gameStats.data["current_player"] : -1;
    const p1_addy = gameStats.version ? gameStats.data["p1"] : "";
    // console.log(p1_addy);
    const p2_addy = gameStats.version ? gameStats.data["p2"] : "";
    const gameType = gameStats.version && gameStats.data["gameType"] == 1 ? "single" : "multi";
    const gameOver = gameStats.version && gameStats.data["is_game_over"];
    const winnerInt = gameStats.version && gameStats.data["winner"];
    // console.log(gameStats.data["winner"]);
    console.log(p1_addy);
    console.log(gameStats);
    console.log(currentAccount?.address);
    const winner = gameStats.version && ((winnerInt == 1 && currentAccount?.address == p1_addy) || (winnerInt == 2 && currentAccount?.address == p2_addy));
    // let profile1: Profile = {username: "User", points: 69, profilePicUrl: "../../f-42.png"};
    // let profile2: Profile = {username: "AI", points: 69, profilePicUrl: "../../f-42.png"};
    // console.log(profile1);
    console.log(winner);
    if (profile1 && profile1.username == "User") {
        fetchProfile(p1_addy).then((profile) => {
            // console.log("bfgasgfhesafkhaekjfhjase");
            if(profile){
                setProfile1(profile!);
            }
            // console.log(profile);
        });
        if (gameType == "multi") {
            fetchProfile(p2_addy).then((profile) => {
                if(profile){
                    setProfile2(profile!);
                }
            });
        }
    }
    myTurn = ((currentAccount?.address == p1_addy && current_player == 1) || (currentAccount?.address == p2_addy && current_player == 2));
    // console.log(gameStats.data);

    useEffect(()=>{
        getUpdatedBoard();
    },[]) 
            
    // const getGameCreationEvents = () => {
    //     fetchEvents().then((events) => {
    //         console.log("888888")
    //         console.log(events);
    //         events?.forEach((event) => {
    //             let eventData = event.parsedJson as any;
    //             let x = (Date.now() - Number(event.timestampMs)) < 2000;
    //             console.log(Number(event.timestampMs));
    //             console.log(x);
    //             if (x && (eventData.game == gameID)){
    //                 setKey(prevKey => prevKey + 1);
    //             }
    //         });
    //     });
    // };
                    

    const sendPlayerMoveTransaction = (column: number) => {
        let transaction = player_move(gameID!, column, version, gameType);
        // transaction.setGasBudget(5000000000);
        // console.log(transaction);
		doTransaction(transaction);			
    };

    const sendWinTransaction = () => {
        player_win(gameID!, version, profile1.id!, profile1.pointsAddy!, (gameType == "multi" ? profile2 : profile1).pointsAddy!, gameType).then((tx) => {
            console.log(tx);
            doTransaction(tx);	
        });	
    };

    const doTransaction = (transaction: Transaction) => {
        signAndExecuteTransaction({
			transaction: transaction!,
			chain: `sui:${myNetwork}`,
		}, {
		    onSuccess: (result) => {
				console.log('executed transaction', result);
                // getUpdatedBoard();
			},
            onError: (error) => {
                console.log(error);
            }
		});	
    };

    const getUpdatedBoard = () => {
        clearInterval(interval);
        interval = setInterval(() => {
            // console.log("jjdjdjdjdjdjdjdjdjdjdjdjdjdjdj");
            setKey(prevKey => prevKey + 1);
        }, 1000);
    };

    const displayRows = (key: number) => {
        const board = [];
        if(gameStats.version && gameStats.version != ""){
            for(let c = 5; c >= 0; c--){
                const row = [];
                for (let r = 0; r < 7; r++) {
                    const color = (gameStats.version != "" &&  gameStats.data["board"]? gameStats.data["board"][c][r] : "");
                    row.push(<div className={"gamespace spaceColor"+color} key={`${c*c}${r*r}`}>
                        <div className={"gamespaceCover spaceCover"+color} key={`${c*c}${r*r}`}></div>
                    </div>);
                }
                board.push(row);
            }
            return board;
        }
    };

    const shorten_addy = (input: string) => {
        const firstPart = input.slice(0, 5);
        const lastPart = input.slice(-5);
        return `${firstPart}...${lastPart}`;
    }

    // If its my turn based who went first and the status, determine which type of transaction based on status
        return (
            <div id="gameboard-body">
                <div className="connectButtonWrapper">
                    <ConnectButton></ConnectButton>
			    </div>
                <div className="logo_gameboard">
                        {/* <Find4Animation size={3} animated={false} /> */}
                        <a href="/" className="logo" style={{marginLeft:0,marginTop:0, fontSize:60}}><span style={{position: "relative", bottom: 14}}>Find</span><img src="../../f4-42.png" style={{width: 70, height: 70, marginLeft: 3, bottom: 4, position: "relative"}} /><span style={{position: "relative", bottom: 13}}>.io</span></a>
     
                </div>
                
                <div className="profileContainer" style={{marginRight:0}}>
                    <span className="profilePoints"><FontAwesomeIcon icon={faTrophy} /> {profile1.points}</span><br></br>
                    <img style={{top:(timer >= 0 ? 48-timer : 48), left: (timer >= 0 ? 60-timer : 60), border: `green ${current_player == 1 ? timer : 0}px solid`}} className="profilePic" src={profile1.profilePicUrl} /><br></br>
                    <span className="profileUsername">{profile1.username}</span><br></br>
                    <span className="profileAddy">{shorten_addy(p1_addy)}</span><br></br>
                    <div style={{backgroundColor: "yellow", width: 100, height: 100, margin:"auto", marginTop: 225, borderRadius:50, position:"relative"}}>
                        <div className="gamespaceCover spaceCover1"></div>
                    </div>
                </div>
                <div className="profileContainer" style={{marginLeft:"calc(50vw + 400px)"}}>
                    <span className="profilePoints"><FontAwesomeIcon icon={faTrophy} /> {profile2.points}</span><br></br>
                    <img style={{border: `green ${current_player == 2 ? timer : 0}px solid`, borderRadius: 110}} className="profilePic" src={profile2.profilePicUrl} /><br></br>
                    <span className="profileUsername">{profile2.username}</span><br></br>
                    <span className="profileAddy">{shorten_addy(p2_addy)}</span><br></br>
                    <div style={{backgroundColor: "red", position:"relative", width: 100, height: 100, margin:"auto", marginTop: 225, borderRadius:50}}>
                        <div className="gamespaceCover spaceCover2"></div>
                    </div>
                </div>
                <div id="gameboard">
                {displayRows(key)}
                {myTurn ? <>
                    <button className="selectColumn" style={{left: "7px"}} onClick={() => {sendPlayerMoveTransaction(0)}}></button>
                    <button className="selectColumn" style={{left: "121px"}} onClick={() => {sendPlayerMoveTransaction(1)}}></button>
                    <button className="selectColumn" style={{left: "235px"}} onClick={() => {sendPlayerMoveTransaction(2)}}></button>
                    <button className="selectColumn" style={{left: "349px"}} onClick={() => {sendPlayerMoveTransaction(3)}}></button>
                    <button className="selectColumn" style={{left: "463px"}} onClick={() => {sendPlayerMoveTransaction(4)}}></button>
                    <button className="selectColumn" style={{left: "577px"}} onClick={() => {sendPlayerMoveTransaction(5)}}></button>
                    <button className="selectColumn" style={{left: "691px"}} onClick={() => {sendPlayerMoveTransaction(6)}}></button>
                </> : <></>}
                </div>
                {currentAccount && gameOver ? <div className="winnerLoserDiv">
                    {winner ? <>
                    Winner
                    <button onClick={() => sendWinTransaction()}>Win Tx</button>
                    </>: <>Loser</>}
                </div> : <></>}
            </div>
        );

//   return (<></>);
}

export default GameBoard;
