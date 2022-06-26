# qnalert

Utility to alert users when a VEX Q&A has been answered. Subscribe to Q&A notifications by joining the [Unofficial VEX Nexus](https://discord.gg/yX9n7dJ) discord server.

# Setup 
## env
In order to run qnalert, you need a `.env` file that contains the following
- `DISCORD_BOT_TOKEN`: A discord bot token, which you can obtain by making a new application [here](https://discord.com/developers/applications)
- `FIREBASE_AUTH`: A firebase [service account key](https://firebase.google.com/docs/admin/setup).
- `PROD`: Should be true or false depending on whether you want to use a development config or a production config.

## Configuration
Development and production configs go in `devconfig.json` and `config.json` respectively (at the root of the project). Each given category should have a Discord channel ID. See the config in this project for more details.


# Running
## Node
Place the `.env` file in the root directory of the project.
```
npm i
npm run start
```

## Docker
```
docker run --env-file /path/to/.env battlesquid0101/qa
```