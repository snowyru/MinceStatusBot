// Import the discord.js module
const Discord = require('discord.js');

// Import the dotenv module
require('dotenv').config();

// Create an instance of a Discord client
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

let serverStatus = null;
let serverCheckInterval = null;

// When the client is ready, run this code
client.once('ready', () => {
    const channel = client.channels.cache.get(process.env.CHANNEL_SEND_ID);
    channel.send('The bot has started.');
    serverCheckInterval = setInterval(() => {
        if (serverStatus !== 'down') {
            channel.send('The server is down.');
            channel.setName('server-status-🔴');
            serverStatus = 'down';
        }
    }, 320000);
});

// This event triggers whenever a message is received
client.on('messageCreate', message => {
    if (message.channel.id === process.env.CHANNEL_RECEIVE_ID && message.content === 'Server is up') {
        clearInterval(serverCheckInterval);
        const channel = client.channels.cache.get(process.env.CHANNEL_SEND_ID);
        if (serverStatus !== 'up') {
            channel.send('The server is up.');
            channel.setName('server-status-🟢');
            serverStatus = 'up';
        }
        serverCheckInterval = setInterval(() => {
            if (serverStatus !== 'down') {
                channel.send('The server is down.');
                channel.setName('server-status-🔴');
                serverStatus = 'down';
            }
        }, 320000);
    }
});

// Log the bot in using the token
client.login(process.env.TOKEN);

