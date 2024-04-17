const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { db } = require('../../firebase.js');

require('dotenv').config();



// What functions do we need from this command?
//      - Function to validate data
//      - Function to link to firebase (nested in validate function, if conditions are met)



async function addToFirebase(name, link, sheetName, startingRow, discordColumn, checkBoxColumn, logTextChannel, serverID)
{

    let docID = serverID + '-' + name;

    var testRef = db.collection(serverID).doc(name)
    const dataToSend = {

        ['checkInName']: name,
        ['checkInLink']: link,
        ['checkInSheetName']: sheetName,
        ['checkInstartingRow']: startingRow,
        ['checkInDiscordColumn']: discordColumn,
        ['checkInCheckBoxColumn']: checkBoxColumn,
        ['checkInlogTextChannel']: logTextChannel,
        ['checkInStatus']: 'created',
        ['checkInID']: serverID + '-' + name

    }

    const res = await testRef.set(dataToSend, {merge: true});

}



async function validateData(name, link, sheetName, startingRow, discordColumn, checkBoxColumn, logTextChannel, serverID)
{

    let conditionsAreMet = true;
    let errorList = [];

    // A bunch of if statements in here where we validate data for certain paramaters, not a necessity for the meantime because I will confirm we enter correct information
    if (name == 'false')
    {

        conditionsAreMet = false;
        errorList.push('hehe u messed up');

    }

    if (conditionsAreMet == true)
    {

        addToFirebase(name, link, sheetName, startingRow, discordColumn, checkBoxColumn, logTextChannel, serverID)
        
    }

    return (errorList);

}



module.exports = {

    data: new SlashCommandBuilder()
        .setName('checkin-create')
        .setDescription('Links a google sheet to the Discord bot')
        .addStringOption(option => option
            .setName('name')
            .setDescription('The name of the tournament, league, or checkin that you want to run.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('link')
            .setDescription('Google sheets link to the checkin spreadsheet.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('sheetname')
            .setDescription('The name of the sheet that the checkin list is on.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('startingrow')
            .setDescription('The number of the row that the checkin list starts on.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('discordcolumn')
            .setDescription('The letter of the column that the list of discord names will be on.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('checkboxcolumn')
            .setDescription('The letter of the column that the checkboxes will be located at.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('logtextchannel')
            .setDescription('[OPTIONAL] The text channel where the log of button presses will be sent.')
            .setRequired(false)),

        async execute(interaction, client) {

            const message = await interaction.deferReply({

                fetchReply: true

            });

            const checkInName = interaction.options.getString("name");
            const checkInLink = interaction.options.getString("link");
            const checkInSheetName = interaction.options.getString("sheetname");
            const checkInStartingRow = interaction.options.getString("startingrow");
            const checkInDiscordColumn = interaction.options.getString("discordcolumn");
            const checkInCheckBoxColumn = interaction.options.getString("checkboxcolumn");
            const checkInLogTextChannel = interaction.options.getString("logtextchannel");

            let newLogChannel = 'none';

            if (checkInLogTextChannel != null)
            {

                newLogChannel = checkInLogTextChannel;

            } 

            let embedTitle = checkInName + ' Creation Succeeded!';
            //let embedThumbnail = ('https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1200px-Eo_circle_green_checkmark.svg.png')
            let embedDescription = 'Please ensure that [emailhere] has editing permissions on the checkin sheet.';
            let embedColor = '#41A145';

            const { guild } = interaction;
            const serverID = guild.id;

            let listOfErrors = await validateData(checkInName, checkInLink, checkInSheetName, checkInStartingRow, checkInDiscordColumn, checkInCheckBoxColumn, newLogChannel, serverID);

            if ((listOfErrors.length) > 0)
            {

                embedTitle = 'Checkin Creation Failed.';
                //embedThumbnail = ('https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Cross_red_circle.svg/2048px-Cross_red_circle.svg.png')
                embedDescription = 'Please ensure that the entered fields are correct and try again.';
                embedColor = '#FF0000';

            }

            let embed = new EmbedBuilder()
                .setTitle(embedTitle)
                //.setThumbnail(embedThumbnail)
                .setDescription(embedDescription)
                .setColor(embedColor)

            await interaction.editReply({

                embeds: [embed]

            })

        }

}