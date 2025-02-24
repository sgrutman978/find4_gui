import { Profile } from './GameBoard';
import axios from 'axios';
import { baseUrl, port } from './sui_controller';


export const sendOnlineStatus = async (addy: string) => {
    // console.log("send online status "+addy);
    axios.post(`${baseUrl}:${port}/imonline`, {
      addy: addy,
    }, {
      headers: {
        'Content-Type': 'application/json' // Adjust if needed
      }
    })
    .then(response => {
      // Handle the response data
    //   console.log(response.data);
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error);
    });
};

export const updateProfileServer = async (addy: string) => {
  // console.log("send online status "+addy);
  axios.post(`${baseUrl}:${port}/updateProfile`, {
    addy: addy,
  }, {
    headers: {
      'Content-Type': 'application/json' // Adjust if needed
    }
  })
  .then(response => {
    // Handle the response data
  //   console.log(response.data);
  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error);
  });
};

// export const sendUpdateProfile = async (addy: string) => {
//   // console.log("send online status "+addy);
//   axios.post(`${baseUrl}:${port}/imonline`, {
//     addy: addy,
//   }, {
//     headers: {
//       'Content-Type': 'application/json' // Adjust if needed
//     }
//   })
//   .then(response => {
//     // Handle the response data
//   //   console.log(response.data);
//   })
//   .catch(error => {
//     // Handle errors
//     console.error('Error:', error);
//   });
// };

export const getP2 = async (addy: string) : Promise<string> => {
	try {
		const response = await axios.get(`${baseUrl}:${port}/getP2?addy=${addy}`);
		// console.log(response.data.p2);
        return response.data.p2;
	} catch (error) {
		console.log(error);
        return "";
	}
};

export const getOnlineList = async () : Promise<string[]> => {
	try {
		const response = await axios.get(`${baseUrl}:${port}/onlineList`);
		// console.log(response.data.p2);
        return response.data.addys;
	} catch (error) {
		console.log(error);
        return [];
	}
};

export const getProfileFromServer = async (addy: string) : Promise<Profile> => {
	try {
		const response = await axios.get(`${baseUrl}:${port}/getProfile?addy=${addy}`);
		// console.log(response.data.p2);
    if((!response.data.profile || !response.data.profile.points)){
      updateProfileServer(addy);
    }
        return response.data.profile;
	} catch (error) {
		console.log(error);
        return {};
	}
};

export const getWhoTurn = async (gameId: string) : Promise<number> => {
	try {
		const response = await axios.get(`${baseUrl}:${port}/whoTurn?gameId=${gameId}`);
		// console.log(response.data.p2);
        return response.data.turn;
	} catch (error) {
		console.log(error);
        return 0;
	}
};

export const getLeaderboard = async () : Promise<[{}]> => {
	try {
		const response = await axios.get(`${baseUrl}:${port}/leaderboard`);
		console.log(response.data.profiles);
        return response.data.profiles;
	} catch (error) {
		console.log(error);
        return [{}];
	}
};

export const getHowManyOnline = async () : Promise<number> => {
	try {
		const response = await axios.get(`${baseUrl}:${port}/howmanyonline`);
		// console.log(response.data.size);
        return response.data.size-1;
	} catch (error) {
		console.log(error);
        return 0;
	}
};

