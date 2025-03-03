import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import DoTransaction, { newMultiPlayerGameTx, fetchEvents, myNetwork, newSinglePlayerGameTx, /*fetchProfile,*/ create_or_edit_profile, suiClient, OGAddyForEventObjType, /*GetProfile*/ } from './sui_controller';
import { Profile } from './GameBoard';
import { getProfileFromServer, updateProfileServer } from './ServerConn';
import { ImageWithFallback } from './Utility';
import { useEnokiFlow } from '@mysten/enoki/react';
import CopyToClipboard from './CopyToClipboard';
import GameSuiteClient from './sui_controller';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
 
 function ProfileButtonAndPanel(props: any) {
    // const [myAddy, setmyAddy] = useState<string | null>(null);
    const [toggle, setToggle] = useState(false);
    const [myProfile, setMyProfile] = useState<Profile>();
    const [showPanel, setShowPanel] = useState(false);
    const [formUsername, setFormUsername] = useState("");
    const [formNftAddy, setFormNftAddy] = useState("");
    const [profilePic, setProfilePic] = useState<any>("");

        const [suiBalance, setSuiBalance] = useState("");
        const [ffioBalance, setFfioBalance] = useState("");
        const OneCoinNineDecimals = 1000000000;

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const gsl = new GameSuiteClient(useEnokiFlow(), useCurrentAccount(), signAndExecuteTransaction);

	useEffect(() => { 
        setProfilePic("");
        getProfile();
        getBalances();
    }, [gsl.myAddy]);

    function getProfile(){
        console.log("mehhhhhh1");
        if(gsl.myAddy){
            console.log("mehhhhhh2");
            getProfileFromServer(gsl.myAddy!).then((profile) => {
                console.log("mehhhhhhhhh3");
                console.log(profile);
                setMyProfile(profile);
                console.log(profilePic);
                setFormUsername(profile?.username!);
                setFormNftAddy(profile?.profilePicUrl!);
                if(profile){
                    setProfilePic(<ImageWithFallback src={profile?.profilePicUrl} classname="profilePicInButton" styles={{}} />);
                }else{
                    openPanel();
                    setProfilePic(<ImageWithFallback src={"../../default-avatar.png"} classname="profilePicInButton" styles={{}} />);
                }
            });
        }else{
            setMyProfile(undefined);
        }
    }

    function openPanel(){
        setShowPanel(true);
    }

    function closePanel(){
        setShowPanel(false);
    }

    const handleUsernameChange = (event: any) => {
        setFormUsername(event.target.value);
    };

    const handleNftAddyChange = (event: any) => {
        setFormNftAddy(event.target.value);
    };

        async function getBalances(){
          if(gsl.myAddy){
            suiClient.getBalance({ owner: gsl.myAddy }).then((res) => {
              console.log(res.totalBalance);
              const b = Math.floor((parseInt(res.totalBalance)/OneCoinNineDecimals)*10000)/10000;
              setSuiBalance(b+"");
              console.log(suiBalance);
            });
            suiClient.getBalance({ owner: gsl.myAddy, coinType: `${OGAddyForEventObjType}::FFIO::FFIO` }).then((res) => {
              console.log(res.totalBalance);
              const b = Math.floor((parseInt(res.totalBalance)/OneCoinNineDecimals)*10000)/10000;
              setFfioBalance(b+"");
              console.log(suiBalance);
            });
          }
        }

    async function handleSubmit(){ //create: boolean){
        console.log("create");
        // console.log(myProfile);
        // console.log(formUsername);
        // console.log(formNftAddy);
        if(formUsername && formUsername){
            let tx = await create_or_edit_profile(formUsername, formNftAddy); //create ? await create_or_edit_profile(formUsername, formNftAddy) : await editProfile(formUsername, formNftAddy, myProfile?.id!);
            // console.log(transaction);
            gsl.doTransaction(tx, () => {
                closePanel();
                    updateProfileServer(gsl.myAddy!);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2500);
            });
        }else{
            alert("Missing username or profile picture URL");
        }
    }    

        useEffect(() => {
            console.log(window.location.pathname);
            if(window.location.pathname == "/login_redirect"){
                gsl.enokiFlow.handleAuthCallback().then(() => {
                    // window.location.href = "/app";
                });
            }
            gsl.enokiFlow.$zkLoginState.subscribe((state) => {
                // setmyAddy(state?.address!);
                getBalances();
                console.log(state);
            });
        }, []);
    
        const handleGoogleSignInOut = () => {
            gsl.handleEnokiLogins("http://localhost:3000/login_redirect", "google", "1010386909639-p3bjjhp05pnk5vhsqak41lausgtk75nf.apps.googleusercontent.com");
        };

	return (
	<>
        {gsl.myAddy ? <div className="profile-container">
            <button className="profileButton" onClick={() => {setToggle(prev => !prev)}}>
                {profilePic}
             {myProfile?.username ? myProfile?.username : "Create Profile"}
            </button>
        <div className={`login-panel ${toggle ? 'active' : ''}`}>
            {/* <button className="login-btn wallet-btn">Connect Wallet</button> */}
            {/* <ConnectButton></ConnectButton> */}
            {/* OR */}
            {gsl.myAddy ? <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <CopyToClipboard addy={gsl.myAddy} />
            </div> 
            : <></>}
            {gsl.myAddy ? <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}><span style={{marginRight: 7, marginLeft: 5}}>
              <img style={{width: 18, marginRight: 2, top: 2, position: "relative"}} src="./sui-logo.png" />
              <span style={{fontSize: 18}}>{suiBalance}</span>
            </span> 
            <span style={{marginRight: 12}}>
              <img style={{width: 18, marginRight: 3, top: 3, position: "relative", borderRadius: 9}} src="./f4-42.png" />
              <span style={{fontSize: 18}}>{ffioBalance}</span>
            </span></div> 
            : <></>}
            {gsl.isEnoki ? <button className="login-btn logout-btn" onClick={() => {gsl.logoutEnoki(); setToggle(false);}}>Logout</button> : <ConnectButton></ConnectButton>}
            {/* <button className="login-btn other-btn">Other Login</button> */}
        </div>
        </div> : <div className="profile-container">
            <button className="profileButton" onClick={() => {setToggle(prev => !prev)}}>
                {profilePic}
             {myProfile?.username ? myProfile?.username : "Sign In"}
            </button>
        <div className={`login-panel ${toggle ? 'active' : ''}`}>
            {/* <button className="login-btn wallet-btn">Connect Wallet</button> */}
            <ConnectButton></ConnectButton>
            OR
            <button className="login-btn google-btn" onClick={() => {handleGoogleSignInOut()}}>Login with Google</button>
            {/* <button className="login-btn other-btn">Other Login</button> */}
        </div>
        </div>}

        {showPanel ? (<><div className="overlay" onClick={() => closePanel()}></div>
            <div className="popup">
            <h2>{myProfile ? "Edit Profile" : "Create Profile"}</h2>
            {/* <form id="nftForm"> */}
                <label>Username:</label><br></br>
                <input type="text" id="username" name="username" onChange={handleUsernameChange} value={formUsername} required />
                <br></br>
                <label>Image Url:</label><br></br>
                <input type="text" id="nftAddress" name="nftAddress" onChange={handleNftAddyChange} value={formNftAddy} required />
                {/* <label>Mainnet NFT Address:</label><br></br> */}
                {/* <input type="text" id="nftAddress" name="nftAddress" onChange={handleNftAddyChange} required /> */}
                <br></br>
                <button onClick={() => handleSubmit(/*myProfile == undefined*/)}>Submit</button>
            {/* </form> */}
            </div></>) : <></>}
	</>
	);
}

export default ProfileButtonAndPanel;
