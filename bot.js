// Import the discord.js module
const { Client, GatewayIntentBits } = require('discord.js');
const net = require('net');

// Import the dotenv module
require('dotenv').config();

// Create an instance of a Discord client with necessary permissions
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let serverStatus = null;
let serverCheckInterval = null;

// Function to check if the Minecraft server is online
function checkServerStatus() {
    const socket = new net.Socket();
    socket.setTimeout(3000); // 3-second timeout

    socket.connect(25565, process.env.SERVER_IP, () => {
        // Server is up
        socket.destroy();
        if (serverStatus !== 'up') {
            const channel = client.channels.cache.get(process.env.CHANNEL_SEND_ID);
            if (channel) {
                channel.send('The server is up.')
                    .then(() => {
                        return channel.setName('server-status-🟢');
                    })
                    .then(() => {
                        console.log('Channel name updated to server-status-🟢');
                        serverStatus = 'up';
                    })
                    .catch(console.error);
            } else {
                console.error('Channel not found or bot does not have access.');
            }
        }
    });

    socket.on('error', () => {
        // Server is down
        socket.destroy();
        if (serverStatus !== 'down') {
            const channel = client.channels.cache.get(process.env.CHANNEL_SEND_ID);
            if (channel) {
                channel.send('The server is down.')
                    .then(() => {
                        return channel.setName('server-status-🔴');
                    })
                    .then(() => {
                        console.log('Channel name updated to server-status-🔴');
                        serverStatus = 'down';
                    })
                    .catch(console.error);
            } else {
                console.error('Channel not found or bot does not have access.');
            }
        }
    });

    socket.on('timeout', () => {
        // Server is down
        socket.destroy();
        if (serverStatus !== 'down') {
            const channel = client.channels.cache.get(process.env.CHANNEL_SEND_ID);
            if (channel) {
                channel.send('The server is down.')
                    .then(() => {
                        return channel.setName('server-status-🔴');
                    })
                    .then(() => {
                        console.log('Channel name updated to server-status-🔴');
                        serverStatus = 'down';
                    })
                    .catch(console.error);
            } else {
                console.error('Channel not found or bot does not have access.');
            }
        }
    });
}

// When the client is ready, run this code
client.once('ready', () => {
    const channel = client.channels.cache.get(process.env.CHANNEL_SEND_ID);
    if (channel) {
        channel.send('The bot has started.')
            .then(() => {
                return channel.setName('server-status-🟢');
            })
            .then(() => {
                console.log('Channel name updated to server-status-🟢');
                serverCheckInterval = setInterval(checkServerStatus, 320000); // Check every 320 seconds
            })
            .catch(console.error);
    } else {
        console.error('Channel not found or bot does not have access.');
    }
});

// Log the bot in using the token
client.login(process.env.TOKEN).catch(console.error);