require('dotenv').config();
const Request = require('request');

const db = require('./database/Database.js');
const config = require('./config/config.js');
const hook = require('./misc.js');

let endpoint = config.endpoint + process.env.STEAM_API + '&steamids=';

(async() => {
    console.log('AccountTracker has started!');

    // Building the final api-endpoint
    config.idsToTrack.forEach(id => {
        endpoint = endpoint + `,${id}`;
    });

    setInterval(() => {
        // Sending the request to the Steam api
        Request(endpoint, async function(error, response, body) {
            const jsonData = JSON.parse(body);
            const players = jsonData['response']['players'].length;

            // Looping through each id
            for (let i = 0; i < players; i++) {

                // Defining the values for the current id
                const pSteamID = jsonData['response']['players'][i]['steamid'];
                const pPersonaName = jsonData['response']['players'][i]['personaname'];
                const pProfileUrl = jsonData['response']['players'][i]['profileurl'];
                const pAvatarUrl = jsonData['response']['players'][i]['avatarfull'];

                // Check if id already exists --> If not insert it to the database
                if (!await db.Exists(pSteamID)) db.Insert(pSteamID, pPersonaName, pProfileUrl);

                // Getting previously saved data from the database
                const dbData = await db.GetData(pSteamID);
                const prePersonaName = dbData[0].persona;
                const preProfileUrl = dbData[0].profileurl;

                // Comparing the values
                if (prePersonaName != pPersonaName) {
                    console.log(`${pSteamID} changed his username!`);
                    db.Update(pSteamID, 'persona', pPersonaName); 
                    hook.Send(pSteamID, pPersonaName, pProfileUrl, pAvatarUrl, 'persona', prePersonaName);
                }

                if (preProfileUrl != pProfileUrl) {
                    console.log(`${pSteamID} changed his profileurl!`);
                    db.Update(pSteamID, 'profileurl', pProfileUrl);
                    hook.Send(pSteamID, pPersonaName, pProfileUrl, pAvatarUrl, 'profileurl', preProfileUrl);
                }
            }
        });
    }, config.checkInterval);
})();