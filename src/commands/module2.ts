import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { generateOpenAIResponse } from '../services/openAi';
import config from '../config.json';

const MODULE_2_CHANNEL_ID = config.MODULE_2_CHANNEL_ID;

const module2Info: { [key: string]: string } = {
  "finding comparable sales": `Finding Comparable sales:
- DO NOT COMPARE OVER HIGHWAYS
- Find properties in the same neighborhood (preferably 3-6 blocks NOT ZIP CODES)
- Same # of beds, baths, square footage (400 sqft above or below), style of home (rowhome, ranch style, etc.)
- Year it was built (e.g., house built in 2020-2021)
- Aim for 3 comparable houses sold in the last 6 months (nothing past 1 year looking back, expand the distance more than expand year)
- Always click both (so it is MLS and public record)`,
  "where to find comparable sales": `Where do I find Comparable Sales?
- Houseflipping9to5.com (PROPSTREAM)
- Redfin.com (FREE)
- Zillow.com (FREE)
- Realtor.com (FREE)
- TRULIA.COM (FREE)`,
  "determining the after repair value": `Determining the After Repair Value (ARV):
- Homeowner neighborhoods (higher-end areas where people want to live. Houses cost more.)
  - Take the average of 3 comparable properties
  - Choose comps that are as close as possible (same # of beds, bathrooms, and sqft)
- Rental neighborhoods (Every hood in America, Baltimore, Detroit, Chicago)
  - As-is comparable sales - no ARV
  - No such thing as an ARV (no matter how much $$ you put in, you only look at the cash buyers that pay for these)
  - You look for the lowest a cash buyer paid for (you offer this amount)
  - You can try to sell for the highest a cash buyer bought for
- The simplest way to find the ARV is to find other properties in the same neighborhoods (preferably within 3-6 Blocks), with the same number of beds, baths, square footage, style of home (rowhome, ranch style, etc.), and the year it was built.
- Aim for a minimum of 3 comparable houses sold within the last 6 months.
- Use a combination of:
  - Houseflipping9to5.com (Propstream)
  - Redfin.com (Free)
  - Zillow.com (Free)`,
  "estimating repair cost": `Estimating Repair Cost:
- We are making offers based on as-is conditions. We look for other properties that are in solid condition with similar square footage and property type.
- Repair cost matters to our cash buyer. We make offers based on this Estimated Repair Cost sheet.
  - If property is under 1500 sqft:
    - Light - $10k
    - Average - $25k
    - Heavy - $50k
  - If property is 1500-2500 sqft:
    - Light - $15k
    - Average - $35k
    - Heavy - $75k
  - If property is 2500-3500 sqft:
    - Light - $25k
    - Average - $45k
    - Heavy - $90k
  - If property is 3500-5000 sqft:
    - Light - $30k
    - Average - $55k
    - Heavy - $100k
- Light means carpet, paint, & maybe floors
- Average means all the above plus kitchen and bath upgrades
- Heavy means full renovation`
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('module2')
    .setDescription('Get information about Module 2: Real Estate Calculations')
    .addStringOption(option => 
      option.setName('topic')
        .setDescription('Topic to get information about')
        .setRequired(true)
        .addChoices(
          { name: 'Finding Comparable Sales', value: 'finding comparable sales' },
          { name: 'Where to Find Comparable Sales', value: 'where to find comparable sales' },
          { name: 'Determining the After Repair Value', value: 'determining the after repair value' },
          { name: 'Estimating Repair Cost', value: 'estimating repair cost' }
        ))
    .addStringOption(option => 
      option.setName('question')
        .setDescription('Ask a specific question related to the topic')
        .setRequired(true)),
  async execute(interaction: CommandInteraction) {

    if (interaction.channelId !== MODULE_2_CHANNEL_ID) {
        await (interaction as CommandInteraction).reply({
          content: `Can\'t use this command in this Channel!, Use this Channel: <#${MODULE_2_CHANNEL_ID}>`,
          ephemeral: true
        });
        return;
      }
    const topic = interaction.options.get('topic')?.value as string;
    const userQuestion = interaction.options.get('question')?.value as string | undefined;

    await interaction.deferReply(); 

    let response = module2Info[topic.toLowerCase()] || 'Topic not found.';

    if (userQuestion) {
      const openAIResponse = await generateOpenAIResponse(userQuestion, topic, response);
      
      const fullResponse = `**Question:** ${userQuestion}\n\n**Answer:** ${openAIResponse}\n\n**Are you ready for module two quiz?**`;
      
      const embed = new EmbedBuilder()
        .setColor('#c4001f')
        .setTitle(`Information on ${topic}`)
        .setDescription(fullResponse)
        .setTimestamp()
        .setAuthor({ name: `${interaction.user.displayName}`, iconURL: `${interaction.user.displayAvatarURL()}`, url: `${interaction.user.displayAvatarURL()}` })
        .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` });
    
      await interaction.editReply({ embeds: [embed] });
    }
  }    
};
