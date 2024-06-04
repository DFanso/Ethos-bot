import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Replies with steps, table of contents, and directions on how to use the bot'),
  async execute(interaction: CommandInteraction) {
    const steps = `
**Welcome to the Real Estate Bot!**

Here are the steps to get started:
1. Choose a module from the table of contents below.
2. Use the appropriate command in Each Module's Channel to get information on a specific topic within the module.
3. Ask any specific question you have related to the topic.

**Table of Contents:**
**Module 1 - Introduction**
  - Wholesale Real Estate
  - Goal Setting
  - Real Estate Lingo
  - Sites we will be using
  - Property Types
  - Neighborhood Class Types
  - Business Set up

**Module 2 - Real Estate Calculations**
  - Finding Comparable Sales
  - Where to Find Comparable Sales
  - Determining the After Repair Value (ARV)
  - Estimating Repair Cost

**Module 3 - Finding Deals**
  - Finding Hot Spots to Find Deals
  - List Source Steps to Finding Hot Zip Codes
  - Propstream 9to5 Finding Hot Zip Codes

**Module 4 - Motivated Sellers**
  - Types of Motivated Sellers to Target
  - Finding Cheap Homes from Motivated Sellers
  - Getting Phone Numbers of Motivated Sellers (Skip Tracing)

**Module 5 - Talking to Sellers / Negotiating**
  - Four Pillars to Cold Calling
  - The Benefits you Provide
  - Presenting Offers
  - Closing the Deal
  - Negotiating Price Reductions
  - Follow Ups
  - How Many Calls Does it Take to Get a Deal
  - List Stacking

**Module 6 - Cash Buyers**
  - Types of Cash Buyers
  - Finding Cash Buyers to Buy your Properties
  - Finding the Owner of an LLC
  - Marketing to Cash Buyers
  - Negotiating with Buyers

**Module 7 - Contracts**
  - Types of Contracts to Use to Buy the Properties

**Module 8 - Building your Team**
  - Building your Dream Team
  - Hiring People for Cheap to Help Run your Business
  - Training your VAs
  - Daily Communication
  - VA Challenges

**Directions:**
- Use commands like \`/module1\` to \`/module8\` followed by the topic name to get detailed information.
- For example, use \`/module1 wholesale real estate\` to learn about wholesale real estate.
- You can also ask specific questions by including your question after the topic name.

Enjoy exploring and learning with the Real Estate Bot!`;

    const embed = new EmbedBuilder()
      .setColor('#0a75ad')
      .setTitle('Hello and Welcome!')
      .setDescription(steps)
      .setTimestamp()
      .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` });

    await interaction.reply({ embeds: [embed] });
  },
};
