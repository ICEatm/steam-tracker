const Datastore = require('nedb');

// Creates the file if does not exist and loads it automatically
const db = new Datastore({ filename: './tracking.db', autoload: true });

/**
 * Get informations about a id
 * @param {int} steamId 
 * @returns The document, if the id exists otherwise false
 */
async function GetData(steamId) {
    return await new Promise((resolve, reject) => {
        db.find(
            {
                steamid: steamId
            },
            function (error, document) {
                if (error) reject(error);
                document.length > 0 ? resolve(document) : resolve(false);
            }
        )
    });
}

/**
 * Check if a id already exists
 * @param {int} steamId 
 * @returns True, if the id exists otherwise false
 */
async function Exists(steamId) {
    return await new Promise((resolve, reject) => {
        db.find(
            {
                steamid: steamId
            },
            function (error, document) {
                if (error) reject(error);
                document.length > 0 ? resolve(true) : resolve(false);
            }
        )
    });
}

/**
 * Inserts a new entry to the database
 * @param {int} steamid Accounts Steam64-ID 
 * @param {string} personaname Accounts personaname
 * @param {string} profileurl Accounts profileurl
 */
function Insert(steamId, personaName, profileUrl) {
    console.log(`${steamId} has been added to the database!`);
    db.insert(
        {
            steamid: steamId,
            persona: personaName,
            profileurl: profileUrl
        }, function(error) {
            if (error) return console.error(`${error.message} for ${steamId} (Insert)`);
        }
    )
}

/**
 * Updating a value in the database
 * @param {int} steamId Accounts Steam64-ID 
 * @param {string} toChange What to change inside of the database
 * @param {string} newValue New value
 */
function Update(steamId, toChange, newValue) {
    switch (toChange) {
        case 'persona':
            // Changing the persona
            db.update(
                // Key to search
                {
                    steamid: steamId
                },
                // What to update
                {
                    $set:
                    {
                        persona: newValue
                    }
                },
                // Optional options
                {},
                // Callback
                function(error) {
                    if (error) return console.error(`${error.message} for ${steamId} (UpdatePersona)`);
                }
            );
            break;
        case 'profileurl':
            // Changing the profileurl
            db.update(
                // Key to search
                {
                    steamid: steamId
                },
                // What to update
                {
                    $set:
                    {
                        profileurl: newValue
                    }
                },
                // Optional options
                {},
                // Callback
                function(error) {
                    if (error) return console.error(`${error.message} for ${steamId} (UpdateProfileUrl)`);
                }
            );
            break;
    }
}

// Exporting our functions
module.exports = {
    Insert,
    Update,
    Exists,
    GetData
};