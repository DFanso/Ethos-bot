import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { generateOpenAIResponse } from '../services/openAi'; // Import the updated service

const module1Info: { [key: string]: string } = {
  "wholesale real estate": "Wholesale real estate is a way to buy and sell real estate contracts. Wholesalers act as intermediaries between sellers and buyers, who are usually investors. A wholesaler will usually contact owners of distressed properties and convince them to open a wholesale contract.",
  "goal setting": `Goals for wholesale real estate include:
1. Find distressed property/distressed owner
2. Make an offer on Property
3. Sign a Purchase Agreement with the owner
4. Find a Cash Buyer to pay more than what you have under contract for
5. Close on the Property
6. Collect Your Check
7. Repeat two hours a day, 5x a week`,
  "real estate lingo": `ARV - After Repair Value; how much a property is worth after it’s completely renovated
    Comps - Comparable Sales; what are the comparable sales in the area
    Free & Clear - No debts, mortgage, or liens (A property that is paid off)
    Turnkey - Property that requires no rehab and is move-in ready
    Property Specialist - Someone to go take pics of the property (makes us sound a lot more professional)
    Vacant - A property that has no one living in it
    Occupied - A property that has someone living in it
    Absentee Owner - Homeowner that does not live in the property they own
    Pre-Foreclosures - Process has begun for property to be repossessed
    Financial Partners - Our cash buyers
    HUD 1/Closing Statement - Official document all properties receive when the sale of a property takes place`,
  "sites we will be using": `Podio - free forever we will be using it during course
    List Source - we will be using this during the course
    houseflipping9to5.com - Free 7-day trial will be using module 1
    https://www.textmagic.com/ - will have to pay for - will be using module`,
  "property types": `Rowhomes
    SFH - Single Family Home
    Condos
    Townhomes`,
  "neighborhood class types": `A Class Neighborhood: Downtown area. Usually a Starbucks every couple of blocks. Very Expensive area to live in. Most of the population has high-paying jobs/careers. The average person makes above 100k a year.
    B Class Neighborhood: Usually suburban areas. Maybe live less than a mile away from a nice mall. These people have great jobs but don’t want to pay for very expensive houses in the city. Houses are on the higher end but have a few discounted properties you will find at times. The average person makes 70-100k a year.
    C Class Neighborhood: Can be in the city or the suburbs. Rely on public transportation to get around. Houses are very affordable. Not far from grocery stores and Metros. The average person makes 40-70k a year.
    D Class Neighborhood: Low Income`,
  "business set up": `Create an LLC (incfile.com)
    Business Email
    Logo
    Expensify (mobile app, business tax write-offs)
    Google Apps - Docs, Sheets, Drive
    CRM - Customer Relationship Management
    Recommended Podio.com (mobile app)
    You’ll need to sign docs electronically
    - Hello sign
- DocHub
Separate phone number for business calls
- Google Voice (Free)
- GoDaddy
- Sideline
- CallRail`,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('module1')
    .setDescription('Get information about Module 1: Introduction')
    .addStringOption(option => 
      option.setName('topic')
        .setDescription('Topic to get information about')
        .setRequired(true)
        .addChoices(
          { name: 'Wholesale Real Estate', value: 'wholesale real estate' },
          { name: 'Goal Setting', value: 'goal setting' },
          { name: 'Real Estate Lingo', value: 'real estate lingo' },
          { name: 'Sites We Will Be Using', value: 'sites we will be using' },
          { name: 'Property Types', value: 'property types' },
          { name: 'Neighborhood Class Types', value: 'neighborhood class types' },
          { name: 'Business Set Up', value: 'business set up' }
        ))
    .addStringOption(option => 
      option.setName('question')
        .setDescription('Ask a specific question related to the topic')
        .setRequired(false)),
  async execute(interaction: CommandInteraction) {
    const topic = interaction.options.get('topic')?.value as string;
    const userQuestion = interaction.options.get('question')?.value as string | undefined;

    await interaction.deferReply(); // Acknowledge the interaction immediately

    let response = module1Info[topic.toLowerCase()] || 'Topic not found.';

    if (userQuestion) {
      const openAIResponse = await generateOpenAIResponse(userQuestion, topic);
      response += `\n\nAdditional Information:\n\n${openAIResponse}`;
    }

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`Information on ${topic}`)
      .setDescription(response)
      .setTimestamp();
      

    await interaction.editReply({ embeds: [embed] }); 
  },
};
