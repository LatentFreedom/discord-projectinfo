# Discord Project Info Bot
Get a bot to gather wallets for a presale in discord.

## Sites Used
1. Discord Dev URL **[https://discord.com/developers/applications](https://discord.com/developers/applications)**
2. Discord Bot Docs **[https://discord.com/developers/docs/intro](https://discord.com/developers/docs/intro)**

## Running the bot
1. Get the needed packages with `npm install`
2. Create `.env` and fill it with the needed values
3. Create `projectinfo.json` and fill it with the needed values
4. Add images to `./images/sneakpeak/`
5. run with `node index.js`

## Values in `.env`
```
DISCORD_TOKEN=
# guild id for the discord server that commands will be in
GUILD_ID=
# channel id for the channel that will reply to the commands
CHANNEL_ID=
```

## Values in `projectinfo.json`
```
{
    "projectinfo": {
        "name" : "projectname",
        "about": "This is a description about the project.",
        "release": "4/20/2022",
        "price": "0.42069 ETH",
        "supply": "6969",
        "links": {
            "website": "https://discord.com",
            "twitter": "https://twitter.com/discord"
        },
        "sneakpeak": "./images/sneakpeek"
    }
}
```

## Discord / Commands
1. **help:** Show help menu with all the commands listed
2. **supply:** Show total supply of the mint
3. **price:** Show price of a single mint
4. **about:** Show about paragraph for the project
5. **links:** Send official project links
6. **release:** Show release date for the project
7. **sneakpeek:** Send random sneak peak image