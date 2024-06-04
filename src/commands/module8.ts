import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { generateOpenAIResponse } from '../services/openAi';

const module8Info: { [key: string]: string } = {
  "building your dream team": `Building your Dream Team:
- Virtual Assistance (VA) - Someone that you can hire to cold call and qualify your leads for you.`,
  "hiring people for cheap to help run your business": `Hiring people for cheap to help run your business:
- Https://www.intergriapartners.com/mit-smith
- Upwork: Post a job - short time or part time work
  - Real Estate Cold Caller (Lead Generation)
    - Skills: cold calling, lead generation, scheduling, data entry, sales, outbound sales
    - Industry: real estate
    - Scope: 3 to 6 months
    - Skill level: Intermediate
    - Worldwide
    - Hourly range $3-$7 an hour ($50 a week)
    - Looking for Real Estate cold caller to make 200 calls a day 5 days a week
    - A script will be provided (attach the script)`,
  "training your VAs": `Training your VAs:
- Role Play - train VAs to meet your expectations; run through the script with them
- Screencast-o-matic - record yourself doing the tasks so that VAs can study
  - Shows VA how to do the work by screen recording and you talking
- Bi-Weekly/Monthly Meetings - build rapport with your VAs and a culture of teamwork
- Every time you close a deal, give your VA some kind of bonus
- Pay them on time`,
  "daily communication": `Daily Communication:
- WhatsApp
- Slack`,
  "VA challenges": `VA Challenges:
- If your VA is located in the Philippines, they are 12 hours difference
- Adverse weather conditions impact wifi
- Cultural differences and American conversational norms
- English - Speaking skills
  - Train your VAs and role play with them
  - Practice with them`
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('module8')
    .setDescription('Get information about Module 8: Building your team')
    .addStringOption(option => 
      option.setName('topic')
        .setDescription('Topic to get information about')
        .setRequired(true)
        .addChoices(
          { name: 'Building your Dream Team', value: 'building your dream team' },
          { name: 'Hiring People for Cheap to Help Run your Business', value: 'hiring people for cheap to help run your business' },
          { name: 'Training your VAs', value: 'training your VAs' },
          { name: 'Daily Communication', value: 'daily communication' },
          { name: 'VA Challenges', value: 'VA challenges' }
        ))
    .addStringOption(option => 
      option.setName('question')
        .setDescription('Ask a specific question related to the topic')
        .setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const topic = interaction.options.get('topic')?.value as string;
    const userQuestion = interaction.options.get('question')?.value as string | undefined;

    await interaction.deferReply(); 

    let response = module8Info[topic.toLowerCase()] || 'Topic not found.';

    if (userQuestion) {
      const openAIResponse = await generateOpenAIResponse(userQuestion, topic, response);
      
      const fullResponse = `**Question:** ${userQuestion}\n\n**Answer:** ${openAIResponse}\n\n**Are you ready for module eight quiz?**`;
      
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
