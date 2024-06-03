import {
  CommandInteraction,
  ModalSubmitInteraction,
  ButtonInteraction,
  Client,
  Interaction
} from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import config from '../config.json';

const ALLOWED_CHANNEL_ID = config.channelId;


module.exports = {
  name: 'interactionCreate',
  async execute(interaction: Interaction, client: Client) {
    if (interaction.channelId !== ALLOWED_CHANNEL_ID) {
      await (interaction as CommandInteraction).reply({
        content: 'Can\'t use this command in this Channel!',
        ephemeral: true
      });
      return;
    }

    if (
      !interaction.isCommand() &&
      !interaction.isModalSubmit() &&
      !interaction.isButton()
    ) return;

    // Handle command interactions
    if (interaction.isCommand()) {
      try {
        const commandPath = join(__dirname, '../commands', `${interaction.commandName}.ts`);
        const command = require(commandPath);
        await command.execute(interaction as CommandInteraction);
      } catch (error) {
        console.error(error);
        await (interaction as CommandInteraction).reply({
          content: 'An error occurred while executing this command.',
          ephemeral: true
        });
      }
    }
  }
};
