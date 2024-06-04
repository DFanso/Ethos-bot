import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { generateOpenAIResponse } from '../services/openAi';

const module3Info: { [key: string]: string } = {
  "finding hot spots to find deals": `Finding hot spots to find deals:
- Google address to see what the property looks like & the area surrounding
- Houseflipping9to5.com (propstream) (row houses = condo/townhome on this site)
- Redfin (free) (filter high to low, last 6 months, same house type,)
- Zillow.com (free)
- Realtor.com (free)
- Trulia.com (free)`,
  "list source steps to finding hot zip codes": `List source: steps to finding hot zip codes:
1. Create your own
2. city/state (add)
3. Property (tab) - property type - (Townhome, SFR)
4. Equity % - (99 / 100%)
5. Last market sale date - (Last 12 months)
6. Options tab - (Absentee Owned)
7. Trustee-owned Properties - (Exclude) Corporate-owned Properties- (No Preference)
8. Address Completeness Requirements - (Both Mailing and Property address complete)
9. Purchase list - purchase partial list (tab) - custom selection - zip code`,
  "propstream 9to5 finding hot zip codes": `Propstream 9to5 - Finding hot zip codes:
1. ENTER zip code
2. Filter: owner occupied: (No)
3. Ownership info tab: (Last sale date - 6 months ago to today's date)
4. Valuation & Equity Info: 100% equity`,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('module3')
    .setDescription('Get information about Module 3: Finding Deals')
    .addStringOption(option => 
      option.setName('topic')
        .setDescription('Topic to get information about')
        .setRequired(true)
        .addChoices(
          { name: 'Finding Hot Spots to Find Deals', value: 'finding hot spots to find deals' },
          { name: 'List Source Steps to Finding Hot Zip Codes', value: 'list source steps to finding hot zip codes' },
          { name: 'Propstream 9to5 Finding Hot Zip Codes', value: 'propstream 9to5 finding hot zip codes' }
        ))
    .addStringOption(option => 
      option.setName('question')
        .setDescription('Ask a specific question related to the topic')
        .setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const topic = interaction.options.get('topic')?.value as string;
    const userQuestion = interaction.options.get('question')?.value as string | undefined;

    await interaction.deferReply(); 

    let response = module3Info[topic.toLowerCase()] || 'Topic not found.';

    if (userQuestion) {
      const openAIResponse = await generateOpenAIResponse(userQuestion, topic, response);
      
      const fullResponse = `**Question:** ${userQuestion}\n\n**Answer:** ${openAIResponse}\n\n**Are you ready for module three quiz?**`;
      
      const embed = new EmbedBuilder()
        .setColor('#065535')
        .setTitle(`Information on ${topic}`)
        .setDescription(fullResponse)
        .setTimestamp()
        .setAuthor({ name: `${interaction.user.displayName}`, iconURL: `${interaction.user.displayAvatarURL()}`, url: `${interaction.user.displayAvatarURL()}` })
        .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` });
    
      await interaction.editReply({ embeds: [embed] });
    }
  }    
};
