import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { newMultiPlayerGameTx, fetchEvents, myNetwork, newSinglePlayerGameTx, /*fetchProfile,*/ create_or_edit_profile, GetProfile } from './sui_controller';
import { Profile } from './GameBoard';
 
 function ProfileButtonAndPanel(props: any) {
	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	// const currentAccount = useCurrentAccount();
  	// const [changeMade, setChangeMade] = useState(0);
    const [myProfile, setMyProfile] = useState<Profile>();
    const [showPanel, setShowPanel] = useState(false);

    const [formUsername, setFormUsername] = useState("");
    const [formNftAddy, setFormNftAddy] = useState("");

    useEffect(() => { 
        console.log(props.profile);
        setMyProfile(props.profile);
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
    }, [props.profile]);

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
        // console.log(create);
        console.log(myProfile);
        let tx = await create_or_edit_profile(formUsername, formNftAddy); //create ? await create_or_edit_profile(formUsername, formNftAddy) : await editProfile(formUsername, formNftAddy, myProfile?.id!);
		// console.log(transaction);
		signAndExecuteTransaction({
			transaction: tx,
			chain: `sui:${myNetwork}`,
		}, {
			onSuccess: (result) => {
				console.log('executed transaction', result);
			},
			onError: (e) => {
				console.log(e);
			}
		});	
    }    
 
	return (
	<>
		{props.currentAddy != "" ? 
            <button className="profileButton" onClick={() => openPanel()}>
                <img className="profilePicInButton" src={myProfile?.username ? myProfile?.profilePicUrl : "../../default-avatar.png"} />
                {myProfile?.username ? myProfile?.username : "Create"}
            </button> : <></>
        }

        {showPanel ? (<><div className="overlay" onClick={() => closePanel()}></div>
            <div className="popup">
            <h2>{myProfile ? "Edit Profile" : "Create Profile"}</h2>
            {/* <form id="nftForm"> */}
                <label>Username:</label><br></br>
                <input type="text" id="username" name="username" onChange={handleUsernameChange} required />
                <br></br>
                <label>Image Url:</label><br></br>
                <input type="text" id="nftAddress" name="nftAddress" onChange={handleNftAddyChange} required />
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
