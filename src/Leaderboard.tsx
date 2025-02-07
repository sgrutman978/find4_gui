import React, { useEffect, useState } from 'react';
import NewGameButton from './NewGameButton';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { myNetwork, programAddress } from './sui_controller';
// import Header from './Header';
// import './Navbar.css';
import { ConnectButton, useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import Find4Animation from './Find4Animation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faHome, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { getLeaderboard } from './ServerConn';
import { ImageWithFallback, shortenAddy } from './Utility';
import CopyToClipboard from './CopyToClipboard';

function Leaderboard() {

    const [profiles, setProfiles] = useState([{}]);

    useEffect(() => {
        getLeaderboard().then((profiles) => {
            setProfiles([]);
            profiles.reverse().forEach(prof => {
                console.log(prof);
                setProfiles(prev => [...prev, prof]);
            });
        });
    }, []);


    const SuiTable = () => {
        return (
          <table className="leaderboard-container">
            {/* <thead>
              <tr>
                <th>SUI Address</th>
                <th>Points</th>
                <th>Username</th>
              </tr>
            </thead> */}
            <span style={{fontSize: 60, fontWeight: 600, margin: 20}}>Leaderboard</span>
            <tbody>
              {profiles.map((item: any, index: number) => (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td><FontAwesomeIcon icon={faTrophy} /> {item.points}</td>
                  <td className="leaderboardUsernamePic">
                    <ImageWithFallback src={item.profilePicUrl} classname="" styles={{ width: '50px', height: '50px', borderRadius: 25 }} />
                    {item.username}
                  </td>
                  <CopyToClipboard item={item} />
                </tr>
              ))}
            </tbody>
            <a href="/app">
                <FontAwesomeIcon icon={faHome} className="yellowHome" />
            </a>
          </table>
        );
      };

  return (<div>
    <SuiTable />
  </div>);
}

export default Leaderboard;