const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;
module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0h2ZU8xTHUzNDhYSUQ0YjZEaXRlYkMrT1U0dXo1S3dwYmkvRFN4MXBYbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZmNLSTlobkZIYStpNUh2dWtPWFM3Q09ieURYU1grNnJWQzlQWG1STHl6TT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ1S2g4OVJNNi9RTWRpT2RWcmZYbVBvMG1Xa0FYWG50OVU4Y1Mwd2lnT1g4PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJWOHdha0Fvd3dRMEpVMGVTV0QwSUdkNWUrN0plb3NJL1hiV04zTE1sTHpnPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InVKZWgwQXE1dkhGTWxyUWd4QUpCNlhRTk5URWc5aFNiUFZuVElyUURMVTQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InlmbzhsWGZDTTJlbHFzRmxuWGMzSjRZWHFQcjZpdFdqcEJvS1k3R2o0Q0U9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic0lMaEZVcS8yZXlBNVRRVTRsSXJCNnVpdkdRUFU0YW0vRkhZTkVObUhFdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoielpCMnZDaFlMQy8rMFBJKzM5Z1dJM0lrRTE5elJPN243K09ZU0lUYVZrUT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InlxbnRZMFRhQXVUZCtTeTB0RGNYMjA5SGJCTlUrUHp2OTBnM3pGQUN1NmxkMkw1Skh0UXMyeXIzNjgwVGlsYm9uK2Q1SGpCV0xFM2hKUlFEK0FsYUFRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTEsImFkdlNlY3JldEtleSI6IlNabjZELzhRdmxNK2pIS3NtRHJ4WDhOQWIwdjVpMzRwcDZoOGZWWWw5MU09IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IndmNnNNTmc3VDA2aGF4Y29BZ2lBSFEiLCJwaG9uZUlkIjoiNDk0MDMwYTgtYTMzNi00YjAzLWJkMzgtNzkwYTg2N2ZmYjE2IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlloVmV4bmlDZ1hadGJTakxyNGNlcExQM2FQUT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJQRWlIWGo2SmlJOHE0UkU4S1I1N3FXZUx3MFU9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiTUFNTTdaMTgiLCJtZSI6eyJpZCI6IjI1NDc1NTA4ODAyOTo3MkBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSlhlZ3FvR0VOTzNrYmtHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiNXdHbjBkUzBQMTVBU2VWdFNFd2VjMnhydEJxWVJMQXM2RW03cFl2eXhsQT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiY2FHZEJsWnUyWWhMcXVDMk9QNEt6ZXpVUFk4clJMUkF4SGNvZkZ5aUZ6YnN6a0pHZkNkZlNmR1VveGk4cGovaUc1YXErTWZVQlBSdWdPbU1jNkUvQ3c9PSIsImRldmljZVNpZ25hdHVyZSI6IlFpZXBvRkc1V2JSRkdXZ1ZwSEN1MTdLcFFDT04vL2pwbm1wM2gvOXo2UHVhRWI3ZWNuN1UvcUJBdkVzZEVBdDRROU1sUWZGczVhWHlieWtIaUEyMUFBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzU1MDg4MDI5OjcyQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmVjQnA5SFV0RDllUUVubGJVaE1Ibk5zYTdRYW1FU3dMT2hKdTZXTDhzWlEifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzA0MzYwNjQsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTCt6In0=',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "Sandy254",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254755088029",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "on",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'on',
    A_REACT: process.env.AUTO_REACTION || 'off',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'online',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech"
        : "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech",
    /* new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
    })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    }), */
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
