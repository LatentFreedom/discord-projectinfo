const {Constants, Client, Intents, MessageEmbed} = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
    intents : [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

let data = {};

client.on('ready', () => {
    console.log('Project Info Running...');
    createCommandsForGuilds();
    getJsonData();
});

const getJsonData = () => {
    let rawdata = fs.readFileSync('projectinfo.json');
    data = JSON.parse(rawdata);
    console.log(data);
}

const styleHelpMessage = () => {
    const embed = new MessageEmbed().setTitle('Command Help')
        .setDescription('The following are the available project info commands.')
        .addFields(
            { name: '/supply', value: 'Show the total supply for the mint' },
            { name: '/price', value: 'Show the price for a single mint' },
            { name: '/about', value: 'Show info about the project' },
            { name: '/links', value: 'Send the official project links' },
            { name: '/release', value: 'Show the release date for the project' },
            { name: '/sneakpeek', value: 'Send a sneak peek picture for the project' },
        );
    return {embeds: [embed]};   
}

const styleSupplyMessage = () => {
    const embed = new MessageEmbed().setTitle('Project Supply')
        .setDescription(`There will be a total of ${data.projectinfo.supply}`);
    return {embeds: [embed]}; 
}

const stylePriceMessage = () => {
    const embed = new MessageEmbed().setTitle('Mint Price')
        .setDescription(`The price for a single mint is ${data.projectinfo.price}`);
    return {embeds: [embed]}; 
}

const styleAboutMessage = () => {
    const embed = new MessageEmbed().setTitle(`${data.projectinfo.name}`)
        .setDescription(data.projectinfo.about)
    return {embeds: [embed]};
}

const styleOfficialLinksMessage = () => {
    const embed = new MessageEmbed().setTitle('Official Links');
    for (let [title, link] of Object.entries(data.projectinfo.links)) {
        embed.addFields({ name: title, value: link});
    };
    return {embeds: [embed]}; 
}

const styleReleaseMessage = () => {
    const embed = new MessageEmbed().setTitle('Release Date')
        .setDescription(`The project will be released on ${data.projectinfo.release}`);
    return {embeds: [embed]};
}

const styleSneakPeekMessage = () => {
    const files = fs.readdirSync(data.projectinfo.sneakpeek);
    let chosenFile = files[Math.floor(Math.random() * files.length)];
    const path = `${data.projectinfo.sneakpeek}/${chosenFile}`;
    const embed = new MessageEmbed().setTitle('Sneak Peek')
        .setDescription(`Check out this sneak peek from the vault!`)
        .setImage(`attachment://${path}`);
    return {embeds: [embed], files: [path]}; 
}

const createCommands = (guildId) => {
    const guild = client.guilds.cache.get(guildId);
    let commands = guild.commands;
    // Show Help
    commands?.create({
        name: "help",
        description: "Show all the commands possible"
    });
    // Show Supply
    commands?.create({
        name: "supply",
        description: "Show the total supply for the mint"
    });
    // Show Price
    commands?.create({
        name: "price",
        description: "Show the price for a single mint"
    });
    // Show About
    commands?.create({
        name: "about",
        description: "Show info about the project"
    });
    // Send Official Links
    commands?.create({
        name: "links",
        description: "Send the official project links"
    });
    // Show Release Date
    commands?.create({
        name: "release",
        description: "Show the release date for the project"
    });
    // Show Sneak Peek
    commands?.create({
        name: "sneakpeek",
        description: "Send a sneak peek picture for the project"
    });
}

const createCommandsForGuilds = () => {
    // Check if guild id set
    if (process.env.GUILD_ID) {
        createCommands(process.env.GUILD_ID);
    } else {
        const Guilds = client.guilds.cache.map(guild => guild.id);
        // Add commands to all guilds
        Guilds.forEach(guildId => {
            createCommands(guildId);
        });
    }
}

client.on('interactionCreate', async (interaction) => {
    try {
        if (!interaction.isCommand()) { return; }
        // Check if command was sent in desired channel
        if (process.env.CHANNEL_ID && interaction.channel.id !== process.env.CHANNEL_ID) {
            await interaction.reply({
                ephemeral: true,
                content: 'This command cannot be used in this channel.'
            });
            return;
        }
        const { commandName } = interaction;
        let content = {};
        await interaction.deferReply({});
        if (commandName === 'help') {
            content = styleHelpMessage();
        } else if (commandName === 'supply') {
            content = styleSupplyMessage();
        } else if (commandName === 'price') {
            content = stylePriceMessage();
        } else if (commandName === 'about') {
            content = styleAboutMessage();
        } else if (commandName === 'links') {
            content = styleOfficialLinksMessage();
        } else if (commandName === 'release') {
            content = styleReleaseMessage();
        } else if (commandName === 'sneakpeek') {
            content = styleSneakPeekMessage();
        }
        await interaction.editReply(content);
    } catch (err) {
        console.log(err);
    }
})

client.login(process.env.DISCORD_TOKEN);