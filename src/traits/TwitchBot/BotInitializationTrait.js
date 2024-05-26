const { OAuth } = require("#Classes/TwitchOAuth");
const { TwitchAPI } = require("#Classes/TwitchAPI");

const BotInitializationTrait = {

    /**
     * Configure the bot before using it
     */
    async configureBot() {

        this.botData = await TwitchAPI.getUserByToken({
            token: this.accessBotToken,
            clientId: process.env.TWITCH_BOT_CLIENT_ID
        });

    },

    /**
     * Set the connection instance for the bot
     * @param {Connection} connection The connection instance to the socket server
     */
    setConnection(connection) {
        this.connection = connection;
    },

    /**
     * Set the scopes that this bot can use
     * @param {Array} scopes The scopes of the token
     */
    setBotScopes(scopes) {
        this.botScopes = scopes;
    },

    /**
     * Authenticate the bot in the Twitch IRC servers
     * @param {String} accessToken The access token returned by Twitch when authenticating the bot
     * @param {String} refreshToken The refresh token returned by Twitch with the acess token
     */
    login(accessToken, refreshToken) {
        
        const { connection } = this;

        connection.sendUTF(`PASS oauth:${accessToken}`); 
        connection.sendUTF(`NICK AnyUser`);

        this.accessBotToken = accessToken;
        this.refreshBotToken = refreshToken;

    },

    /**
     * Refresh the access token and reauthenticates the bot in the Twitch IRC server
     * @returns {Bool} Wether was possible to reauthentica the bot
     */
    async reauthenticateBot() {

        const { saved, token } = await OAuth.refreshToken(this.refreshBotToken, "bot");

        if (saved) {
            this.login(token.access_token, token.refresh_token);
            this.setBotScopes(token.scope);
            return true;
        }

        return false;

    },

}

module.exports = { BotInitializationTrait };