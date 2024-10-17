### EBTV O.R.C.A Bot

A bot which help to handle the management of a Splatoon 3 season on the Discord guild of ebTV Splatoon. It allows interaction with Toornament and their API to facilitate the job of the Tournament Organiser.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [License](#license)

## Features

### addPlayer: `/ajoutJoueur`

**Description:** Add a player to a team on Toornament.

**Usage:** `/ajoutJoueur <@équipeajout> <pseudojoueur>`

**Example:** `/ajoutJoueur @discordRoleTeam playerPseudo`

### cleancastpresaison: `/cleancastpresaison`

**Description:** Delete the casting channel of the preseason.

**Usage:** `/cleancastpresaison`

### cleancastsaison: `/cleancastsaison`

**Description:** Delete the casting channel of the season.

**Usage:** `/cleancastsaison`

### createCastChannel: `/creerchannelcast`

**Description:** Create a casting channel in the division category of the concerned teams.

**Usage:** `/creerchannelcast <@équipe1_cast> <@équipe2_cast> <optional co_cast @user>`

**Example:** `/ajoutJoueur @discordRoleTeam1 @discordRoleTeam2`

### createDivisionLeague: `/creerdivisionligue`

**Description:** Create the categories and channels of the new season.

### createUniqueDivision: `/creeruniquedivision`

**Description:** Create an unique division category with the adequate channels of the season.

**Usage:** `/creeruniquedivision <numDiv>`

**Example:** `/creeruniquedivision 5`

### permissionLeagueDivision: `/permissiondivisionligue`

**Description:** Set all the permission of the category and channels of the season.

### planif: `/planif`

**Description:** Planify the match between two teams on Toornament.

**Usage:** `/planif <@team1> <@team2> <date (format DD/MM/YYYY)> <hour (format HH:MM)>`

**Example:** `/planif @team1 @team2 18/03/2024 18:47`

### report: `/report`

**Description:** Report a match between two teams on Toornament.

**Usage:** `/report <@team1> <@team2> <reported_by>`

**Example:** `/report @team1 @team2 @team_who_reported_match`

### removePlayer: `/retrait`

**Description:** Remove a player from a team on Toornament.

**Usage:** `/retrait <@team1> <playerName>`

**Example:** `/retrait @team1 Tim`

### score: `/score`

**Description:** Set the result of a match between two teams on Toornament.

**Usage:** `/score <@team1> <score (format 4-0)> <@team2>`

**Example:** `/score @team1 4-0 @team2`

### deletionLeagueDivision: `/supressiondivisionligue`

**Description:** Delete all the category and channels of the season.

### deleteUniqueDivision: `/supressionuniquedivision`

**Description:** Delete an unique division category with the channels of the season.

**Usage:** `/supressionuniquedivision <numDiv>`

**Example:** `/supressionuniquedivision 5`

### transfertPlayer: `/transfertjoueur`

**Description:** Transfert a player from one team to an other on Toornament.

**Usage:** `/transfertjoueur <@retreating_player_team> <@adding_player_team> <playerName>`

**Example:** `/transfertjoueur @team1 @team2 Tim`

### urlCaster: `/urlcaster`

**Description:** Allow an user to save it's streaming Youtube or Twitch channel to promote it on a website.

**Usage:** `/urlcaster <stream_name> <stream_url>`

**Example:** `/urlcaster Tim_stream https://www.youtube.com/@user`

## Installation

1. Clone the repository: `git clone https://github.com/Laharls/League_ebtv_bot_sp3.git`
2. Navigate to the root project directory
3. Install dependencies: `npm install`
4. Create a new application and bot user on the [Discord Developer Portal](https://discord.com/developers/applications).
5. Invite the bot on your guild 
6. Copy the content of .env_example and set it up with the details needed.
7. Register the command on your guild : `node .\deploy-commands.js`
8. Start the bot : `node .\index.js`

## License

This project is licensed under the [MIT License](LICENSE).