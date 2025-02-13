import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { newMultiPlayerGameTx, fetchEvents, myNetwork, newSinglePlayerGameTx, /*fetchProfile,*/ create_or_edit_profile, /*GetProfile*/ } from './sui_controller';
import { Profile } from './GameBoard';
import { getProfileFromServer, updateProfileServer } from './ServerConn';
import { ImageWithFallback } from './Utility';
 
 function ProfileButtonAndPanel(props: any) {
	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	// const currentAccount = useCurrentAccount();
  	// const [changeMade, setChangeMade] = useState(0);
    const [myProfile, setMyProfile] = useState<Profile>();
    const [showPanel, setShowPanel] = useState(false);

    const [formUsername, setFormUsername] = useState("");
    const [formNftAddy, setFormNftAddy] = useState("");

    const [profilePic, setProfilePic] = useState<any>("");

    let currentAccount = useCurrentAccount();

	useEffect(() => { 
        setProfilePic("");
        getProfile();
    }, [currentAccount]);

    // useEffect(() => { 
    //     console.log(props.profile);
    //     setMyProfile(props.profile);
        // fetchProfile(props.currentAddy).then(async (profile) => {
        //     console.log(profile);
		// 	if(profile?.points){
		// 		setMyProfile(profile);
		// 	}else{
        //         setMyProfile(undefined);
        //     }
		// }).catch((error) => {
        //     setMyProfile(undefined);
        // });
    // }, [props.profile]);

    function getProfile(){
        console.log("mehhhhhh1");
        if(currentAccount){
            console.log("mehhhhhh2");
            getProfileFromServer(currentAccount.address).then((profile) => {
                console.log("mehhhhhhhhh3");
                console.log(profile);
                setMyProfile(profile);
                console.log(profilePic);
                setFormUsername(profile?.username!);
                setFormNftAddy(profile?.profilePicUrl!);
                if(profile){
                    setProfilePic(<ImageWithFallback src={profile?.profilePicUrl} classname="profilePicInButton" styles={{}} />);
                }else{
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

    async function handleSubmit(){ //create: boolean){
        console.log("create");
        // console.log(myProfile);
        // console.log(formUsername);
        // console.log(formNftAddy);
        if(formUsername && formUsername){
            let tx = await create_or_edit_profile(formUsername, formNftAddy); //create ? await create_or_edit_profile(formUsername, formNftAddy) : await editProfile(formUsername, formNftAddy, myProfile?.id!);
            // console.log(transaction);
            signAndExecuteTransaction({
                transaction: tx,
                chain: `sui:${myNetwork}`,
            }, {
                onSuccess: (result) => {
                    console.log('executed transaction', result);
                    closePanel();
                    updateProfileServer(currentAccount?.address!);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2500);
                    
                },
                onError: (e) => {
                    console.log(e);
                }
            });	
        }else{
            alert("Missing username or profile picture URL");
        }
    }    
 
	return (
	<>
		{currentAccount ? 
            <button className="profileButton" onClick={() => openPanel()}>
                {profilePic}
                {/* <img className="profilePicInButton" src={myProfile?.username ? myProfile?.profilePicUrl : "../../default-avatar.png"} /> */}
                {myProfile?.username ? myProfile?.username : "Create"}
            </button> : <></>
        }

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
