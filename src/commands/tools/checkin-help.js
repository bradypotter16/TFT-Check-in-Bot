const { SlashCommandBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('checkin-help')
        .setDescription('Displays the proper procedure for creating a check-in and using the check-in bot.'),

        async execute(interaction, client) {

            const message = await interaction.deferReply({

                fetchReply: true

            });

            const newMessage = `## Thank you for using Check-In Bot for your tournament!\n\n
\n**__Please use the following commands in order to create your own check in!__**
First, ensure that you have shared your check-in list with **[email here]** and have given it edit privileges.
**/checkin-link** will link the spreadsheet with Discord to be used in the appropriate channel.
**/checkin-start** will begin the check in! Be sure to use this command in the proper channel!
            `;
            
            await interaction.editReply({

                content: newMessage

            });

        }

}