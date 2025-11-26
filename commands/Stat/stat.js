const { SlashCommandBuilder } = require("@discordjs/builders");
const { readdirSync, copyFileSync, stat } = require("fs");
const { EmbedBuilder, MessageFlags } = require("discord.js");
const permIndex = require("../../utils/permIndex");
const categoryList = readdirSync("./commands");
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "key-google.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

//const SPREADSHEET_ID_S5 = "1XvOUvv2CVSgSHercRIUsahlYNXTxeVdTHzb6bnTzKlM";
//const SPREADSHEET_ID_S4 = '1JcxiviVfcYPlIWBzVBOh3RAd0m0zgLcu0hV25KJMBYc';

const ID_SPREAD = {
  s5: "1XvOUvv2CVSgSHercRIUsahlYNXTxeVdTHzb6bnTzKlM",
  s4: "1JcxiviVfcYPlIWBzVBOh3RAd0m0zgLcu0hV25KJMBYc",
};

const sFullName = {
  s5: `Saison 5 <:s5:${process.env.S5_EMOTE_ID}>`,
  s4: `Saison 4 <:s4:${process.env.S4_EMOTE_ID}>`,
};

async function getData(range, nameColIndex, name, saison) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: ID_SPREAD[saison],
    range,
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) return null;

  for (const row of rows) {
    const entityName = row[nameColIndex]?.toLowerCase().trim();
    if (entityName === name.toLowerCase().trim()) {
      while (row.length < 26) {
        row.push("—");
      }
      return row;
    }
  }
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hoursPart = hrs > 0 ? `${hrs}h ` : "";
  const minutesPart = mins > 0 ? `${mins}m ` : "";
  const secondsPart = `${secs}s`;

  return `${hoursPart}${minutesPart}${secondsPart}`.trim();
}

module.exports.execute = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  let subC = interaction.options.getSubcommand();
  let saison = interaction.options.getString("saison");

  if (subC == "joueur") {
    //Joueur
    let statUser = interaction.options.getUser("utilisateur");
    let usename = statUser.username;

    let stats = await getData("Stats joueur bot!B5:BB", 3, usename, saison);

    if (!stats)
      return interaction.editReply({
        content: `Le joueur ${usename} n'as pas de stat !`,
        ephemeral: true,
      });

    const tempsDeJeuJoueur = formatTime(parseInt(stats[30]));

    let embedJoueur = {
      title: `📊 Statistiques du joueur ${stats[2]}`,
      description: sFullName[saison],
      color: 0x3c78d8,
      fields: [
        {
          name: `**Division :** ${stats[0]}\n`,
          value:
            `> **Équipe :** ${stats[1]}\n` +
            `> **Manches jouées :** ${stats[4]}\n` +
            `> **Manches gagnées :** ${stats[5]}\n` +
            `> **Manches perdues :** ${Number(stats[4]) - Number(stats[5])}\n` +
            `> **Taux V / D :** ${stats[6]}\n` +
            `> **Temps de jeu :** ${tempsDeJeuJoueur}\n`,
          inline: true,
        },
        {
          name: `📝 Informations Division ${stats[0]}`,
          value:
            `> **Nb joueurs dans la div :** ${stats[51]}\n` +
            `> **Nb joueurs classés dans la div :** ${stats[50]}\n`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: false,
        },
        {
          name: "⚔️ Liquidations",
          value:
            `> **Avec assist. :** ${stats[8]} (${stats[9]})\n` +
            `> **Sans assist. :** ${stats[12]} (${stats[13]})\n` +
            `> **Assist. :** ${stats[16]} (${stats[17]})\n` +
            `> **Subies :** ${stats[20]} (${stats[21]})\n` +
            `> **Ratio :** ${stats[24]} (${stats[25]})\n`,
          inline: true,
        },
        {
          name: "🔫 Par manche",
          value:
            `> **Avec assist. :** ${stats[10]} (${stats[11]})\n` +
            `> **Sans assist. :** ${stats[14]} (${stats[15]})\n` +
            `> **Assist. :** ${stats[18]} (${stats[19]})\n` +
            `> **Subies :** ${stats[22]} (${stats[23]})\n`,
          inline: true,
        },
        {
          name: "⏱️ Par minute",
          value:
            `> **Avec assist. :** ${stats[42]} (${stats[43]})\n` +
            `> **Sans assist. :** ${stats[36]} (${stats[37]})\n` +
            `> **Assist. :** ${stats[40]} (${stats[41]})\n` +
            `> **Subies :** ${stats[38]} (${stats[39]})\n`,
          inline: true,
        },
        {
          name: "🎯 Divers",
          value:
            `> **Spéciaux :** ${stats[26]} (${stats[27]})\n` +
            `> **Territoire encré :** ${stats[31]} (${stats[32]})\n`,
          inline: true,
        },
        {
          name: "⏱️ Par minute",
          value:
            `> **Spéciaux :** ${stats[44]} (${stats[45]})\n` +
            `> **Territoire encré :** ${stats[46]} (${stats[47]})\n`,
          inline: true,
        },
      ],
    };

    return await interaction.editReply({
      embeds: [embedJoueur],
      ephemeral: true,
    });
  } else if (subC == "equipe") {
    //Equipe
    let statEquipe = interaction.options.getRole("equipe");

    let teamName = statEquipe.name;

    let stats = await getData("Équipes!B4:AA", 1, teamName, saison);

    if (!stats)
      return interaction.editReply({
        content: `L'équipe ${teamName} n'as pas de stat !`,
        ephemeral: true,
      });

    const tempsDeJeuEquipe = formatTime(parseInt(stats[20]));

    let embedEquipe = {
      title: `📊 Statistiques de l'équipe ${teamName}`,
      description: sFullName[saison],
      color: 0xf1c232,
      fields: [
        {
          name: "",
          value:
            `> **Division :** ${stats[0]}\n` +
            `> **Victoires :** ${stats[2]}\n` +
            `> **Défaites :** ${stats[3]}\n` +
            `> **Manches gagnées :** ${stats[4]}\n` +
            `> **Manches perdues :** ${stats[5]}\n` +
            `> **Manches jouées :** ${Number(stats[4]) + Number(stats[5])}\n` +
            `> **% Victoires manches :** ${stats[7]}`,
          inline: false,
        },
        {
          name: "🥊 KO",
          value:
            `> **KO infligés :** ${stats[8]}\n` +
            `> **KO subis :** ${stats[9]}\n` +
            `> **% KO infligés :** ${stats[10]}\n` +
            `> **% KO subis :** ${stats[11]}`,
          inline: true,
        },
        {
          name: "⏱️ Prolongations",
          value:
            `> **Victoires :** ${stats[12]}\n` +
            `> **Défaites :** ${stats[13]}\n` +
            `> **Total :** ${stats[14]}`,
          inline: true,
        },
        { name: "", value: "", inline: true },
        {
          name: "⚔️ Liquidations",
          value:
            `> **Prises :** ${stats[15]}\n` +
            `> **Subies :** ${stats[16]}\n` +
            `> **Ratio :** ${stats[17]}`,
          inline: true,
        },
        {
          name: "⏱️ Par minute",
          value:
            `> **Prises :** ${stats[22]}\n` + `> **Subies :** ${stats[23]}`,
          inline: true,
        },
        { name: "", value: "", inline: true },
        {
          name: "🎯 Autres stats",
          value:
            `> **Spéciaux :** ${stats[18]}\n` +
            `> **Territoire :** ${stats[19]}\n` +
            `> **Temps de jeu :** ${tempsDeJeuEquipe}`,
          inline: true,
        },
        {
          name: "⏱️ Par minute",
          value:
            `> **Spéciaux :** ${stats[24]}\n` +
            `> **Territoire :** ${stats[25]}`,
          inline: true,
        },
      ],
    };

    return await interaction.editReply({
      embeds: [embedEquipe],
      ephemeral: true,
    });
  } else {
    return await interaction.editReply("Chef il y a un problème la");
  }
};

module.exports.info = {
  name: "stats",
  description: "Affcihe les stats",
  rolePermission: [],
  userPersmission: [],
  helpReportType: 2,
  category: "stat",
  active: true,
  isPublic: true,
};

module.exports.dataSlash = new SlashCommandBuilder()
  .setName(this.info.name)
  .setDescription(this.info.description)
  .addSubcommand((sc) =>
    sc
      .setName("joueur")
      .setDescription("Les stats d'un joueur")
      .addUserOption((uop) =>
        uop
          .setName("utilisateur")
          .setDescription("Le joueur a afficher les stats")
          .setRequired(true)
      )
      .addStringOption((so) =>
        so
          .setName("saison")
          .setDescription("La saison correspondante")
          .addChoices([
            {
              name: "Saison 5",
              value: "s5",
            },
            {
              name: "Saison 4",
              value: "s4",
            },
          ])
          .setRequired(true)
      )
  )
  .addSubcommand((sc) =>
    sc
      .setName("equipe")
      .setDescription("Les stats d'une équipe")
      .addRoleOption((uop) =>
        uop.setName("equipe").setDescription("Une ugdhfui").setRequired(true)
      )
      .addStringOption((so) =>
        so
          .setName("saison")
          .setDescription("La saison correspondante")
          .addChoices([
            {
              name: "Saison 5",
              value: "s5",
            },
            {
              name: "Saison 4",
              value: "s4",
            },
          ])
          .setRequired(true)
      )
  );
