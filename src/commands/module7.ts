import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { generateOpenAIResponse } from '../services/openAi';
import config from '../config.json';

const MODULE_7_CHANNEL_ID = config.MODULE_7_CHANNEL_ID;

const module7Info: { [key: string]: string } = {
  "types of contracts to use to buy the properties": `Types of contracts to use to buy the properties:
- Contract of sale - between seller and buyer (You)
- Assignment agreement - between you and the end buyer (cash buyer)
  - You are assigning your rights to the contract to the end buyer. The purchase and sale contract that you (the wholesaler) have with the seller gives you equitable interest in the property, which means the seller cannot sell it to anyone else.
- When speaking to sellers, never use the word “Contract”; use "Agreement"
- Doubleclose.com - when you are dealing with a house that is owned by the state or auction.
- When you have it under contract, you immediately look for a buyer.
- Assignment agreement and purchase agreement goes to the title company.`,

};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('module7')
    .setDescription('Get information about Module 7: Contracts')
    .addStringOption(option => 
      option.setName('topic')
        .setDescription('Topic to get information about')
        .setRequired(true)
        .addChoices(
          { name: 'Types of Contracts to Use to Buy the Properties', value: 'types of contracts to use to buy the properties' }
        ))
    .addStringOption(option => 
      option.setName('question')
        .setDescription('Ask a specific question related to the topic')
        .setRequired(true)),
  async execute(interaction: CommandInteraction) {

    if (interaction.channelId !== MODULE_7_CHANNEL_ID) {
        await (interaction as CommandInteraction).reply({
          content: `Can\'t use this command in this Channel!, Use this Channel: <#${MODULE_7_CHANNEL_ID}>`,
          ephemeral: true
        });
        return;
      }

    const topic = interaction.options.get('topic')?.value as string;
    const userQuestion = interaction.options.get('question')?.value as string | undefined;

    await interaction.deferReply({ephemeral: true}); 

    let response = module7Info[topic.toLowerCase()] || 'Topic not found.';

    if (userQuestion) {
      const openAIResponse = await generateOpenAIResponse(userQuestion, topic, response);
      
      const fullResponse = `**Question:** ${userQuestion}\n\n**Answer:** ${openAIResponse}\n\n**Are you ready for module seven quiz?**`;
      
      const embed = new EmbedBuilder()
        .setColor('#ff7f50')
        .setTitle(`Information on ${topic}`)
        .setDescription(fullResponse)
        .setTimestamp()
        .setAuthor({ name: `${interaction.user.displayName}`, iconURL: `${interaction.user.displayAvatarURL()}`, url: `${interaction.user.displayAvatarURL()}` })
        .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` });
    
      await interaction.editReply({ embeds: [embed] });
    }
  }    
};
