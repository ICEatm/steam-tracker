const { Webhook, MessageBuilder } = require('discord-webhook-node');
const config = require('./config/config.js');
const Hook = new Webhook(config.webhook);

function Send(steamId, personaName, profileUrl, profileAvatar, whatChanged, preValue) {
    switch (whatChanged) {
        case 'persona':
            const PersonaChanged = new MessageBuilder()
                .setDescription(`To view the profile [Click Me!](https://steamcommunity.com/profiles/${steamId})`)
                .setAuthor(`${personaName} | Changed persona`, profileAvatar, `https://steamcommunity.com/profiles/${steamId}`)
                .addField('`Old`', preValue, true)
                .addField('`New`', personaName, true)
                .setTimestamp()
                .setFooter('AccountTracker by darby#0001', 'https://i.imgur.com/LfY5ZSC.png');
            
                Hook.send(PersonaChanged);
            break;
        case 'profileurl':
            const ProfileUrlChanged = new MessageBuilder()
                .setDescription(`To view the profile [Click Me!](https://steamcommunity.com/profiles/${steamId})`)
                .setAuthor(`${personaName} | Changed profileurl`, profileAvatar, `https://steamcommunity.com/profiles/${steamId}`)
                .addField('`Old`', `/id/${preValue.split('/')[4]}`, true)
                .addField('`New`', `/id/${profileUrl.split('/')[4]}`, true)
                .setTimestamp()
                .setFooter('AccountTracker by darby#0001', 'https://i.imgur.com/LfY5ZSC.png');
            
                Hook.send(ProfileUrlChanged);
            break;
    }
}

module.exports = {
    Send
}