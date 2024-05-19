<br/>
<p align="center">
  <a href="https://github.com/Bytenote/byte-o-bert">
    <img src="https://i.imgur.com/ZVsHyCI.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Byte-O-Bert</h1>

  <p align="center">
    One of the Discord Bots of all time
    <br/>
    <br/>
    <a href="https://github.com/Bytenote/byte-o-bert/issues">Report Bug</a>
  </p>

  <div align="center">
	
  ![Contributors](https://img.shields.io/github/contributors/Bytenote/byte-o-bert?color=dark-green) ![Issues](https://img.shields.io/github/issues/Bytenote/byte-o-bert) ![License](https://img.shields.io/github/license/Bytenote/byte-o-bert)

  </div>
</p>

# About The Project

![Screen Shot](https://i.imgur.com/692185e.png)

A simple, privacy-focused Discord Bot with minimal permissions that allows you to add and manage chat commands, either via Slash Command(s) or through a dedicated website.  
Perfect for reliving funny moments with your friends by linking a YouTube video or for mod related actions like showing server rules.

-   _customizable command prefix_
-   _create, update, delete & change active state of commands_
-   _decide who can add the bot to their servers, or make it publicly available_
-   _user details are deleted 30 days after last login_

The application exists of several parts that can be hosted independently of each other on their own server(s).

1. Bot (required): _Handles everything Discord related, like Slash & Chat Commands_
2. Database (required): _Stores server settings, commands and website users_
3. Front- & Backend (optional): _Offers ability to manage server settings via website_

# Getting Started

To host this bot, you'll first need to create a Discord Application in the [Developer Portal](https://discord.com/developers/applications).  
For details on how to set it up check out [this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot).  
It is recommended, but not necessary, to [install PM2 globally](https://pm2.keymetrics.io/docs/usage/quick-start/).

### Prerequisites

-   [Discord Application](https://discord.com/developers/applications)
-   [NodeJS (preferably via nvm)](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
-   [MongoDB local](https://www.mongodb.com/docs/v6.0/administration/install-community/) or [free Atlas Cloud DB](https://www.mongodb.com/free-cloud-database)

### Installation

1. Clone the repository
    ```sh
    git clone https://github.com/bytenote/byte-o-bert.git
    ```
2. Install dependencies
    ```sh
    npm install
    ```
3. Create .env file(s) (see [.env Config](https://github.com/bytenote/byte-o-bert?tab=readme-ov-file#env-config))
4. Set up the database, either [locally](https://www.mongodb.com/docs/v6.0/administration/install-community/) or [in the cloud](https://www.mongodb.com/free-cloud-database)

# Deployment

### .env Config

There are two ways to use env vars for this project.

1. Two .env files: _.env.development & .env.production_
2. One .env file: _.env_

Some variables are only needed for the bot, others only for the front- & backend.  
Depending on what you are hosting, you should remove the variables that are not being used.

For further details and to see what variables to include check out the [.env.example](https://github.com/bytenote/byte-o-bert/blob/main/.env.example) file.

### Proxy Setup

The use of a web server à la nginx is not only supported, but encouraged!  
If you go this route there are a few changes that need to be done.  
_The following are merely the bare minimum additions. Configuring the web server is in your hands_.

-   _include location directive that proxies image requests through your web server to Discord, to exclude unnecessary 3rd party cookies_

    ```
    # removes 3rd party cookies from Discord images (like user and server avatars)
    location ~* ^/(icons|avatars)/(.*)$ {
        set $path_uri $2;
        rewrite ^/(icons|avatars)/(.*)$ /$2 break;
        proxy_set_header Cookie $http_cookie;
        proxy_hide_header Set-Cookie;
        proxy_pass https://cdn.discordapp.com/$1/$path_uri;
    }
    ```

-   _basic load balance setup_

    ```
    upstream instances {
        least_conn;
        server <IP_ADDRESS_1>;
        server <IP_ADDRESS_2>;
        ...
        server <IP_ADDRESS_n>;
    }

    server {
        ...

        location = /graphql {
        	proxy_pass http://instances/graphql;
        }

        location /api/ {
        	proxy_pass http://instances/api/;
        }

        location / {
        	try_files $uri $uri/ $uri.html /index.html;
        }
    }
    ```

### How-To PM2

After completing the above installation steps, navigate into the root of the project.

```sh
cd path/to/your/installation
```

Once there, the first thing to do is to deploy all Slash Commands, so they can be used.  
This is only necessary once, or whenever you add/update/remove a Slash Command.

```sh
npm run commands:deploy
```

After that you can start the bot with the following command, which will spawn a new PM2 process.

```sh
npm run pm2:bot
```

To also manage server settings and chat commands over the web, you need to start the backend.  
The frontend will be build on the first start, which takes a few seconds. Successive starts will be available immediately thanks to the build process being cached.

```sh
npm run pm2:backend
```

If you have not installed PM2 globally, you'll always need to navigate into the project's directory in order to run PM2 commands.  
If you have it installed globally, you can omit 'npx' from each command and can run them from anywhere.  
A few noteworthy and self explanatory PM2 commands are:

```sh
# bot application name: dc-bot
# backend application name(s): node-1, ..., node-n, where n = number of PM2 instances
# get instance ID with 'npx pm2 status'
npx pm2 status <application-name OR instance ID>
npx pm2 logs <application-name OR instance ID>
npx pm2 start <application-name OR instance ID>
npx pm2 stop <application-name OR instance ID>
npx pm2 restart <application-name OR instance ID>

# example global PM2 installation
pm2 status dc-bot

# example non-global PM2 installation
cd path/to/your/project
npx pm2 status dc-bot
```

# Development

It is highly advised to create a second Discord Application and database for testing purposes.  
To start developing, you can use one of the following commands:

```sh
# start bot, front- & backend
npm run dev

# start bot only
npm run dev:bot

# start backend only
npm run dev:backend

# start frontend only
npm run dev:frontend
```

# License

Distributed under the MIT License. See [MIT License](https://opensource.org/license/MIT) for more information.
