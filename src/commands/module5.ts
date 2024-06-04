import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { generateOpenAIResponse } from '../services/openAi';

const module5Info: { [key: string]: string } = {
  "four pillars to cold calling": `Four Pillars to Cold Calling:
1. Motivation - Why do they want to sell?
2. Timeline - When do they want to sell?
3. Condition of property
4. Seller’s Price`,
  "the benefits you provide": `The Benefits you Provide:
- We buy All Cash
- We Buy in As-is Condition
- We Pay All Closing Costs
- There are no realtor fees or commission fees
- We can close in as little as 14 days`,
  "presenting offers": `Presenting Offers:
- A Great Offer = Seller Motivation + the condition of the property + the benefits we provide
  - Use comparable sales as leverage
  - Squeeze everything out of the deal even if the seller is asking the price you need. Act like the price they are asking is still hurting you.
    - “What’s the absolute best you can do?”
  - Use your “Financial Partners” as leverage and build urgency
    - “If I can get my partner on the same page as far as price & we can secure the funds today, would you be able to get the process started today?”
  - IT’S IMPORTANT TO GET THE PRICE OUT OF THE SELLER FIRST!`,
  "closing the deal": `Closing the Deal:
- Create urgency
  - “We are looking at 2 other properties, so if we can agree on (amount) and cover the closing costs and everything, would we be able to”
- Go the Extra mile
- Take Action`,
  "negotiating price reductions": `Negotiating Price Reductions:
- When you call back a seller to get a price reduction because you may have gotten the property under contract for too much`,
  "follow ups": `Follow Ups:
- 70% of deals will come from following up
- If the seller seems a little interested but not all the way there, follow up in 7 days
- If the seller is not interested to sell right now, follow up in 30 days
- If the seller is not interested at all, follow up in 6 months`,
  "how many calls does it take to get a deal": `How many calls does it take to get a deal:
- For best results, the list should be at least 1000 addresses
- Only call the first 3 numbers listed
- Each person should be contacted 2-3 times, then head over to text them
- 150 calls per hour using some kind of dialer
- 30 calls per hour dialing by hand

Calls Per Contact 10% (Example: If we call 1000 people, we should be in contact with 100 people) (Make sure your number doesn't show up as spam)

Contacts Per Lead (Quality of your list) Every 10 people you talk to, one should be interested in selling.
(Example: Out of the 100 people, 10 should be interested in selling)

Leads Per Appointment/signed agreement (Quality of your conversations) Out of those 10 people, 1 should lead to an appointment/contract.

- If you are getting “you are the 15th person who called me”, your list is trash
- If you are not getting 1 contract out of every 10 people you talk to, your “Speaking with seller skills” need work
- The people who you cannot agree to terms with should be a part of your follow-up sequence. This is how you build your pipeline`,
  "list stacking": `List Stacking:
- The process of cross-referencing multiple lists to identify sellers with the most motivations to sell.`
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('module5')
    .setDescription('Get information about Module 5: Talking to Sellers / Negotiating')
    .addStringOption(option => 
      option.setName('topic')
        .setDescription('Topic to get information about')
        .setRequired(true)
        .addChoices(
          { name: 'Four Pillars to Cold Calling', value: 'four pillars to cold calling' },
          { name: 'The Benefits you Provide', value: 'the benefits you provide' },
          { name: 'Presenting Offers', value: 'presenting offers' },
          { name: 'Closing the Deal', value: 'closing the deal' },
          { name: 'Negotiating Price Reductions', value: 'negotiating price reductions' },
          { name: 'Follow Ups', value: 'follow ups' },
          { name: 'How Many Calls Does it Take to Get a Deal', value: 'how many calls does it take to get a deal' },
          { name: 'List Stacking', value: 'list stacking' }
        ))
    .addStringOption(option => 
      option.setName('question')
        .setDescription('Ask a specific question related to the topic')
        .setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const topic = interaction.options.get('topic')?.value as string;
    const userQuestion = interaction.options.get('question')?.value as string | undefined;

    await interaction.deferReply(); 

    let response = module5Info[topic.toLowerCase()] || 'Topic not found.';

    if (userQuestion) {
      const openAIResponse = await generateOpenAIResponse(userQuestion, topic, response);
      
      const fullResponse = `**Question:** ${userQuestion}\n\n**Answer:** ${openAIResponse}\n\n**Are you ready for module five quiz?**`;
      
      const embed = new EmbedBuilder()
        .setColor('#800080')
        .setTitle(`Information on ${topic}`)
        .setDescription(fullResponse)
        .setTimestamp()
        .setAuthor({ name: `${interaction.user.displayName}`, iconURL: `${interaction.user.displayAvatarURL()}`, url: `${interaction.user.displayAvatarURL()}` })
        .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` });
    
      await interaction.editReply({ embeds: [embed] });
    }
  }    
};
