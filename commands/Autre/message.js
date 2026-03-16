const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
} = require("discord.js");
const { STAFF_EBTV } = require("../../utils/roleEnum");
const axios = require("axios");

async function sendMsgEmbed(channel, msg) {
  const msgEmbed = new EmbedBuilder()
    .setTitle(msg.title)
    .setDescription(msg.content)
    .setFooter({
      text: `ID : ${msg.id}`,
    })
    .setTimestamp(new Date(msg.creation));

  const deleteButton = new ButtonBuilder()
    .setCustomId(`g_message_del_${msg.id}`)
    .setStyle(ButtonStyle.Danger)
    .setEmoji(process.env.U_EMOTE_ID)
    .setLabel("Supprimer");

  let row = new ActionRowBuilder().addComponents(deleteButton);

  await channel.send({
    embeds: [msgEmbed],
    components: [row],
  });
}

module.exports.execute = async (interaction) => {
  const channel = await interaction.client.channels.cache.get(
    process.env.FW_MSG_CHANNEL
  );

  let subC = interaction.options.getSubcommand();

  if (subC == "init") {
    await interaction.deferReply();

    const url = `${process.env.FW_API}/message`;
    const config = {
      headers: {
        Authorization: process.env.FW_MSG_KEY,
      },
    };

    let response;

    try {
      response = await axios.get(url, config);
      if (response.status != 200) throw new Error("Reponse invalide");
    } catch (err) {
      return interaction.reply({
        content: "Erreur",
      });
    }

    let messagesApp = response.data.messages;

    await channel.bulkDelete(50);

    messagesApp.forEach((msg) => {
      sendMsgEmbed(channel, msg);
    });

    interaction.editReply({
      content: "Embeds envoyé",
    });
  }

  if (subC == "send") {
    await interaction.deferReply();
    let titre = interaction.options.getString("titre");
    let contentMsg = interaction.options.getString("message");
    let pageString = interaction.options.getString("page");

    let pageToOpen;

    if (!pageString) {
      pageToOpen = "/";
    } else {
      pageToOpen = pageString;
    }

    const url = `${process.env.FW_API}/message`;
    const config = {
      headers: {
        Authorization: process.env.FW_MSG_KEY,
      },
    };
    const body = {
      title: titre,
      content: contentMsg,
      open: pageToOpen,
    };

    let response;

    try {
      response = await axios.post(url, body, config);
      if (response.status != 201) throw new Error("Reponse invalide");
    } catch (err) {
      return interaction.reply({
        content: "Erreur",
      });
    }

    let messageCreated = response.data.message;

    await sendMsgEmbed(channel, {
      title: messageCreated.title,
      content: messageCreated.content,
      id: messageCreated._id,
      creation: messageCreated.creation,
    });

    interaction.editReply({
      content: "Info envoyé !",
    });
  }
};

module.exports.but = async (interaction, butName, butArgs) => {
  if (butName == "del") {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const msgID = butArgs[0];

    const url = `${process.env.FW_API}/message/${msgID}`;
    const config = {
      headers: {
        Authorization: process.env.FW_MSG_KEY,
      },
    };

    let response;

    try {
      response = await axios.delete(url, config);
      if (response.status != 200) throw new Error("Reponse invalide");
    } catch (err) {
      return await interaction.editReply({
        content: "Erreur",
        ephemeral: true,
      });
    }

    await interaction.message.edit({
      content: `# **~~Message supprimer~~**`,
      embeds: [],
      components: [],
    });

    interaction.editReply({
      content: "Message supprimer !",
      ephemeral: true,
    });
  }
};

module.exports.info = {
  name: "message",
  description: "Envoi un message sur l'app fullwipe",
  rolePermission: [STAFF_EBTV],
  userPersmission: [],
  helpReportType: 1,
  category: "autre",
  active: true,
  isPublic: true,
};

module.exports.dataSlash = new SlashCommandBuilder()
  .setName(this.info.name)
  .setDescription(this.info.description)
  .addSubcommand((sc) =>
    sc.setName("init").setDescription("Renvoi tout les message dans le salon")
  )
  .addSubcommand((sc) =>
    sc
      .setName("send")
      .setDescription("Envoi un message dans l'app")
      .addStringOption((opt) =>
        opt
          .setName("titre")
          .setDescription("Le titre du message (21 char max)")
          .setMaxLength(21)
          .setRequired(true)
      )
      .addStringOption((opt) =>
        opt
          .setName("message")
          .setDescription("Le message a envoyé")
          .setMaxLength(500)
          .setRequired(true)
      )
      .addStringOption((opt) =>
        opt
          .setName("page")
          .setDescription("La page que doit ouvrir la notif")
          .setChoices([
            {
              name: "Planning",
              value: "/planning",
            },
            {
              name: "Maps",
              value: "/maps",
            },
            {
              name: "Groupes",
              value: "/groups",
            },
          ])
          .setRequired(false)
      )
  );
