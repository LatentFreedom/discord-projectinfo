const {Constants, Client, Intents, MessageEmbed} = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const { title } = require('process');

const client = new Client({
    intents : [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

let data = {};

client.on('ready', () => {
    console.log('Project Info Running...');
    createCommands();
    getJsonData();
});

const getJsonData = () => {
    let rawdata = fs.readFileSync('projectinfo.json');
    data = JSON.parse(rawdata);
    console.log(data);
}

const styleHelpMessage = async () => {
    const embed = new MessageEmbed().setTitle('Command Help');
    embed.setDescription('The following are the available project info commands.')
    embed.addFields(
        { name: '/supply', value: 'Show the total supply for the mint' },
        { name: '/price', value: 'Show the price for a single mint' },
        { name: '/about', value: 'Show info about the project' },
        { name: '/links', value: 'Send the official project links' },
        { name: '/release', value: 'Show the release date for the project' },
        { name: '/sneakpeak', value: 'Send a sneak peak picture for the project' },
    );
    return {embeds: [embed]};   
}

const styleSupplyMessage = async () => {
    const embed = new MessageEmbed().setTitle('Project Supply');
    embed.setDescription(`There will be a total of ${data.projectinfo.supply}`);
    return {embeds: [embed]}; 
}

const stylePriceMessage = async () => {
    const embed = new MessageEmbed().setTitle('Mint Price');
    embed.setDescription(`The price for a single mint is ${data.projectinfo.price}`);
    return {embeds: [embed]}; 
}

const styleAboutMessage = async () => {
    const embed = new MessageEmbed().setTitle(`${data.projectinfo.name}`);
    embed.setDescription(data.projectinfo.about)
    return {embeds: [embed]};
}

const styleOfficialLinksMessage = async () => {
    const embed = new MessageEmbed().setTitle('Official Links');
    for (let [title, link] of Object.entries(data.projectinfo.links)) {
        embed.addFields({ name: title, value: link});
    };
    return {embeds: [embed]}; 
}

const styleReleaseMessage = async () => {
    const embed = new MessageEmbed().setTitle('Release Date');
    embed.setDescription(`The project will be released on ${data.projectinfo.release}`);
    return {embeds: [embed]};
}

const styleSneakPeakMessage = async () => {
    const files = fs.readdirSync(data.projectinfo.sneakpeak);
    let chosenFile = files[Math.floor(Math.random() * files.length)];
    const path = `${data.projectinfo.sneakpeak}/${chosenFile}`;
    const embed = new MessageEmbed().setTitle('Sneak Peak')
        .setDescription(`Check out this sneak peak from the vault!`)
        .setImage(`attachment://${path}`);
    return {embeds: [embed], files: [`${path}`]}; 
}


const createCommands = () => {
    const Guilds = client.guilds.cache.map(guild => guild.id);
    // Add commands to all guilds
    Guilds.forEach(guildId => {
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
        // Show Sneak Peak
        commands?.create({
            name: "sneakpeak",
            description: "Send a sneak peak picture for the project"
        });
    });
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
            content = await styleHelpMessage();
        } else if (commandName === 'supply') {
            content = await styleSupplyMessage();
        } else if (commandName === 'price') {
            content = await stylePriceMessage();
        } else if (commandName === 'about') {
            content = await styleAboutMessage();
        } else if (commandName === 'links') {
            content = await styleOfficialLinksMessage();
        } else if (commandName === 'release') {
            content = await styleReleaseMessage();
        } else if (commandName === 'sneakpeak') {
            content = await styleSneakPeakMessage();
        }
        await interaction.editReply(content);
    } catch (err) {
        console.log(err);
    }
})

client.login(process.env.DISCORD_TOKEN);