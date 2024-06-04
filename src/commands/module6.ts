import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { generateOpenAIResponse } from '../services/openAi';
import config from '../config.json';

const MODULE_6_CHANNEL_ID = config.MODULE_6_CHANNEL_ID;

const module6Info: { [key: string]: string } = {
  "types of cash buyers": `Types of Cash Buyers:
- Buyers who use cash
- Buyers who use private money or hard money (financing)`,
  "finding cash buyers to buy your properties": `Finding Cash Buyers to Buy your properties:
- https://www.affordablehousing.com
- Houseflipping9to5.com
  - Save list of cash buyers and skip trace
- Facebook marketplace: Real Estate Groups (Go to method)
- Realtors
- Live Auctions
- Bandit Signs
- REIAs (Real Estate Investors Association)
- Partner up with other more experienced Wholesalers (JV)
- Opencorporates (For LLCs)
- https://cashbuyersplus.com`,
  "finding the owner of an llc": `Finding the owner of an LLC:
- Opencorporates.com`,
  "marketing to cash buyers": `Marketing to Cash Buyers:
- Task Rabbit
- Thumbtack
- https://bpophotoflow.com
- Flickr (Free up to 1000 photos)
- Google images
- Drop Box
- Mailchimp
  - Use to send emails to cash buyers (Friday/Saturday mornings)`,
  "negotiating with buyers": `Negotiating with Buyers:
- Talking to Cash Buyers
  - Typically when you find a great deal, finding a buyer will be fairly easy, but you will run into some cash buyers who will try to get over and low ball you, especially if they can sense you are a newbie.
  - Stand firm on your price until many buyers are starting to say the same thing.
  - Make it clear that the buyer is responsible for all closing costs. Once the price is agreed upon, require 1-3k Earnest Money Deposit wired to the title company or given to you directly in the form of a cashier's check within 24 hours. No excuses! If being sent to the title company be sure to send them the wiring instructions.
  - You always want to be in control of the deal and use your title company.
- Knowing when to budge
  - If you get a low ball offer from a cash buyer the first 1-2 days after putting the property on the market don’t take it. See what other buyers think it’s worth.
  - If your contract is about to expire and you are getting a lower offer than you want, take the offer! Some money is better than no money.
  - If you find a cash buyer who needs a longer time to close than usual make them put up more Earnest Money than usual.
- Questions to Ask Cash Buyers
  - What types of properties are you looking to buy?
  - What location are you looking to buy at?
  - What price range are you looking to buy at?
  - Are you using cash or private money?`
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('module6')
    .setDescription('Get information about Module 6: Cash Buyers')
    .addStringOption(option => 
      option.setName('topic')
        .setDescription('Topic to get information about')
        .setRequired(true)
        .addChoices(
          { name: 'Types of Cash Buyers', value: 'types of cash buyers' },
          { name: 'Finding Cash Buyers to Buy your Properties', value: 'finding cash buyers to buy your properties' },
          { name: 'Finding the Owner of an LLC', value: 'finding the owner of an llc' },
          { name: 'Marketing to Cash Buyers', value: 'marketing to cash buyers' },
          { name: 'Negotiating with Buyers', value: 'negotiating with buyers' }
        ))
    .addStringOption(option => 
      option.setName('question')
        .setDescription('Ask a specific question related to the topic')
        .setRequired(true)),
  async execute(interaction: CommandInteraction) {

    if (interaction.channelId !== MODULE_6_CHANNEL_ID) {
        await (interaction as CommandInteraction).reply({
          content: `Can\'t use this command in this Channel!, Use this Channel: <#${MODULE_6_CHANNEL_ID}>`,
          ephemeral: true
        });
        return;
      }

    const topic = interaction.options.get('topic')?.value as string;
    const userQuestion = interaction.options.get('question')?.value as string | undefined;

    await interaction.deferReply(); 

    let response = module6Info[topic.toLowerCase()] || 'Topic not found.';

    if (userQuestion) {
      const openAIResponse = await generateOpenAIResponse(userQuestion, topic, response);
      
      const fullResponse = `**Question:** ${userQuestion}\n\n**Answer:** ${openAIResponse}\n\n**Are you ready for module six quiz?**`;
      
      const embed = new EmbedBuilder()
        .setColor('#ff6666')
        .setTitle(`Information on ${topic}`)
        .setDescription(fullResponse)
        .setTimestamp()
        .setAuthor({ name: `${interaction.user.displayName}`, iconURL: `${interaction.user.displayAvatarURL()}`, url: `${interaction.user.displayAvatarURL()}` })
        .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` });
    
      await interaction.editReply({ embeds: [embed] });
    }
  }    
};
