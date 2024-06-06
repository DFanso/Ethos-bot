import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { generateOpenAIResponse } from '../services/openAi';
import config from '../config.json';

const MODULE_9_CHANNEL_ID = config.MODULE_9_CHANNEL_ID;

const module9Info: { [key: string]: string } = {
  "comping basics": `Comping Basics:
- LOCATION IS KING - SCHOOL DISTRICT CHANGES THINGS
- +/- 200 sqft
- Stay within 2500 sqft +/- lot size
- MUST BE Within 10 years of construction
- +/- $10K-25k for bedroom
- +/- $10k for a bathroom
- BEST COMPS are closest and most recent SOLD
- ALWAYS comp CONSERVATIVELY
- Same stories ONLY
- Don’t cross major roads
- Don’t leave the subdivision`,
  "special features": `Special Features:
- +/- $10k-15k for Pool
- Under $300k ARV -$10k for siding traffic/commercial
  - -$10k for backing traffic/commercial
  - -$10-20k for fronting traffic/commercial
- Basement, guest houses, and lot size. Appraisers will only give you HALF the value for your guest house. You can only add half the value of the guest house to the overall sqft of the actual house.
  - Same applies for Basements`,
  "additional adjustments": `Additional Adjustments:
- +/- $10k for garage
- +/- $5k for carport
- When comping value add (additions) properties, add no more than 1k for added sqft value add`,
  "comping challenges": `Comping Challenges:
- If you can’t find a comp from 3 months inside your subdivision:
  - Go back in increments of 3 months: 3, 6, 9, 12, etc.
  - For example, $300k ARV x 3.5% = $10.5k added to the value of the property
  - Go out in space: 0.5 miles each time you have to: 0.5, 1 mile, 1.5, 2, 2.5
- Comps are from properties that have SOLD. A solid comp is a SOLD comp in the same subdivision and similar build.`
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('module9')
    .setDescription('Get information about Module 9: Estimating the cost')
    .addStringOption(option => 
      option.setName('topic')
        .setDescription('Topic to get information about')
        .setRequired(true)
        .addChoices(
          { name: 'Comping Basics', value: 'comping basics' },
          { name: 'Special Features', value: 'special features' },
          { name: 'Additional Adjustments', value: 'additional adjustments' },
          { name: 'Comping Challenges', value: 'comping challenges' }
        ))
    .addStringOption(option => 
      option.setName('question')
        .setDescription('Ask a specific question related to the topic')
        .setRequired(true)),
  async execute(interaction: CommandInteraction) {

    if (interaction.channelId !== MODULE_9_CHANNEL_ID) {
        await (interaction as CommandInteraction).reply({
          content: `Can't use this command in this Channel!, Use this Channel: <#${MODULE_9_CHANNEL_ID}>`,
          ephemeral: true
        });
        return;
      }

    const topic = interaction.options.get('topic')?.value as string;
    const userQuestion = interaction.options.get('question')?.value as string | undefined;

    await interaction.deferReply(); 

    let response = module9Info[topic.toLowerCase()] || 'Topic not found.';

    if (userQuestion) {
      const openAIResponse = await generateOpenAIResponse(userQuestion, topic, response);
      
      const fullResponse = `**Question:** ${userQuestion}\n\n**Answer:** ${openAIResponse}\n\n**Are you ready for module nine quiz?**`;
      
      const embed = new EmbedBuilder()
        .setColor('#daa520')
        .setTitle(`Information on ${topic}`)
        .setDescription(fullResponse)
        .setTimestamp()
        .setAuthor({ name: `${interaction.user.displayName}`, iconURL: `${interaction.user.displayAvatarURL()}`, url: `${interaction.user.displayAvatarURL()}` })
        .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` });
    
      await interaction.editReply({ embeds: [embed] });
    }
  }    
};
