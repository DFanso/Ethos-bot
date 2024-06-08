import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { generateOpenAIResponse } from '../services/openAi';
import config from '../config.json';

const MODULE_4_CHANNEL_ID = config.MODULE_4_CHANNEL_ID;

const module4Info: { [key: string]: string } = {
  "types of motivated sellers to target": `Types of Motivated Sellers to Target:
- Code Violations
- Evictions
- Vacant
- Expired Listings
- Bankruptcy
- Distressed Homeowners
- Pre-Foreclosures
- Foreclosures
- Inheritances
- Divorce
- Tax Delinquents
- FSBO (For Sale by Owner)
- Aged Homes
- Aged Owners
- Aged Homes with Aged Owners
- Water Liens
- Water Delinquents
- Hospital Liens
- Tax Liens
- IRS Liens
- HOA Liens
- Pre-Inheritances
- Personal Representative Leads
- Attorney Information
- High Equity
- Negative Equity
- Free and Clear
- Reverse Mortgage
- New Homeowners Leads
- REO (Real Estate Owned) / Bank-owned Leads
- Absentee
- Municipal Liens
- Multifamily Leads`,
  "finding cheap homes from motivated sellers": `Finding cheap homes from motivated sellers:
- Find the owner of any property with Google
  - Google: Real property search [State]
  - Select county
  - Street Address
- Driving for Dollars
- Zillow
- For Sale by Owner (FSBO)/
- Bandit Signs
- Yellow letters/Postcards (Handwritten letters)
- Houseflipping9to5.com ($97/month, access to 100,000 leads /month)
- Go to 9-5list.com (Absentee Owned + 60-year-old + Low income/Low Credit)
  - Do not get emails, phone numbers, or landlines
  - Type in city/county
  - Type in Hot Zipcodes
  - Absentee Owner
    - All of the selected motivators
      - Vacant
      - Low income
      - 60+
      - Property type = Single family
    - Flipthisrealestatelist.com (Tax default or code violation)`,
  "getting phone numbers of motivated sellers (skip tracing)": `Getting Phone Numbers of Motivated Sellers (Skip Tracing):
- Houseflipping9to5.com (Propstream)
- Batchskiptracing.com (Bulk skip trace)`
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('module4')
    .setDescription('Get information about Module 4: Motivated Sellers')
    .addStringOption(option => 
      option.setName('topic')
        .setDescription('Topic to get information about')
        .setRequired(true)
        .addChoices(
          { name: 'Types of Motivated Sellers to Target', value: 'types of motivated sellers to target' },
          { name: 'Finding Cheap Homes from Motivated Sellers', value: 'finding cheap homes from motivated sellers' },
          { name: 'Getting Phone Numbers of Motivated Sellers (Skip Tracing)', value: 'getting phone numbers of motivated sellers (skip tracing)' }
        ))
    .addStringOption(option => 
      option.setName('question')
        .setDescription('Ask a specific question related to the topic')
        .setRequired(true)),
  async execute(interaction: CommandInteraction) {
    if (interaction.channelId !== MODULE_4_CHANNEL_ID) {
        await (interaction as CommandInteraction).reply({
          content: `Can\'t use this command in this Channel!, Use this Channel: <#${MODULE_4_CHANNEL_ID}>`,
          ephemeral: true
        });
        return;
      }
    const topic = interaction.options.get('topic')?.value as string;
    const userQuestion = interaction.options.get('question')?.value as string | undefined;

    await interaction.deferReply({ephemeral: true}); 

    let response = module4Info[topic.toLowerCase()] || 'Topic not found.';

    if (userQuestion) {
      const openAIResponse = await generateOpenAIResponse(userQuestion, topic, response);
      
      const fullResponse = `**Question:** ${userQuestion}\n\n**Answer:** ${openAIResponse}\n\n**Are you ready for module four quiz?**`;
      
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle(`Information on ${topic}`)
        .setDescription(fullResponse)
        .setTimestamp()
        .setAuthor({ name: `${interaction.user.displayName}`, iconURL: `${interaction.user.displayAvatarURL()}`, url: `${interaction.user.displayAvatarURL()}` })
        .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` });
    
      await interaction.editReply({ embeds: [embed] });
    }
  }    
};
