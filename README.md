# The Crims Italian Bot V2

This is a new version of the bot [The Crims Italian Bot](https://github.com/grimaldello/the-crims-italian-bot) that I've developed to play the online game [The Crims](https://www.thecrims.com) without manually performing most of the tedious tasks of the game.

The bot V2 has been rewritten from the beginning.

Noteworthy improvements are:
- **Anti-logging mechanism** in order to emulate mouse click and movement (the previous bot lack of this). It can be surely improved, but the basics are in.
- **Added start menu** for selecting the bot action to perform 
- (For developers) **Typescript** as programming language in order to have better code organization

# Do you wanna chat with me or other contributors? 
For discussion not related to the development of the bot, please join this discord server: [Discord Server](https://discord.gg/4WzCZCcK)

# First thing first
I have made this bot on my free time.
So do not expect the perfection from this bot :)

**You can obviously contribute on it in order to improve the bot.**

# Before run the bot
> :warning: Before run the bot make sure that the following points have been done:
> - **Single Robberies: checkbox Full Stamina must be checked**

# How to use the **bot**
You can find here on Github a [Releases](https://github.com/grimaldello/the-crims-italian-bot-v2/releases) ready to use.

In order to start the bot you need to:
- copy all the content of the file `release.js` in the clipboard (I suggest CTRL+A to select all and then CTRL+C to copy the selected text)
- open the console browser, usually using F12 or through the browser menu
- paste the content of the file `release.js` in the browser console
- press ENTER

The bot will prompt the action to do:
![Bot Prompt](media/bot-prompt.png "Bot Prompt")

Insert the number of the action you want to perform and then press OK button.

The bot will start perform the selected action.

> :warning: **TO STOP the bot**, just refresh the browser. Do not perform the refresh inside rave, you could experience bad behavior :)

# Bot settings
The bot has some settings/parameters that can be customized.
To change the settings/parameters you have to search in the `release.js` file the following string:
```
let BotSettingsManager = class BotSettingsManager
```
and then change the values according your needs.

I know that this is not user friendly and can be improved, but it works :)

# Remove DOM elements
The bot has a feature that permits to remove DOM elements from the page so they will not be displayed.

The DOM elements that have to be removed must be defined in the following property, using its query selector:

```
querySelectorsDOMElementsToRemove: [
],
```

For example to remove some images:

```
querySelectorsDOMElementsToRemove: [
    'img[src*="https://static-live.thecrims.com/static/images/avatars/"]',
    'img[src*="https://static-live.thecrims.com/static/images/tc-menu-logo.png"',
],
```


# Mouse movement path strategy
The bot has a feature that permits to set the path strategy to use for mouse movement.

The following property can be used in order to set the mouse movement path strategy to use:

```
coordinatePathStrategy: {
    useLinearPathStrategy: false,
    useWindPathStrategy: true
},
```

Just se to `true` (and the other to `false`) the strategy you want to use.

At the moment is not possible to change values parameters for the strategies.


# Pause and resume bot
Once it has been started, the bot has a functionality to pause and resume its execution.

>In order to be able to use this functionality, you must have the focus on the browser. 
>To get browser focus, you can: 
>    - click on the title bar of the browser (or in most of other parts of the UI of the browser)
>    - click on the website page
>    - other way that at the moment don't come in my mind :)

By default, the pause and the resume functionality can be triggered with the keyboard keys combination `ctrl+alt+s`.

If the combination is pressed while the bot is running, then the bot will pause.

If the combination is pressed while the bot is paused, then the bot will continue from where it paused. 

The keyboard keys combination shortcut to pause and resume the bot execution, can be customized by changing the following properties:
```
pauseResume: {
    ctrlOrMetaKeyNecessary: true,
    altKeyNecessary: true,
    keyboardKeyForPauseResumeBot: "s"
}
```

For example, if you want to pause and resume the bot execution with the shortcut `alt+p`, you have to set the property like the following configuration:
```
pauseResume: {
    ctrlOrMetaKeyNecessary: false,
    altKeyNecessary: true,
    keyboardKeyForPauseResumeBot: "p"
}
```

If you want to pause and resume the bot execution by only pressing the key letter `s`, you have to set the property like the following configuration:
```
pauseResume: {
    ctrlOrMetaKeyNecessary: false,
    altKeyNecessary: false,
    keyboardKeyForPauseResumeBot: "s"
}
```

> :warning: Beware to not use a keyboard keys combination shortcut that can collide with an already existing combination shortcut. For example, if you set `ctrl+s`, it collides with the `Save as...` functionality of the browser and you can get unwanted behaviors.

# Bot speed
The bot has a parameter that can be configured in order to set the speed of the fake cursor.
To change the bot speed, the following property can be updated:
```
mouse: {
    numberOfCoordinatesToSkip: 4
},
```
The higher the value, the faster will be the bot (but a lower number of logs the anti-cheating system creates).
The lower the value, the lower will be the bot, (but a higher number of logs the anti-cheating system creates).

The default value is 4. 
From my tests this is a value with good balance on speed/logs creation.

Moreover from my tests, the bot speed is CPU dependant: a more powerful CPU will perform better even with lower value of this setting.

# Recharging
By default the bot will use a random rave in order to recharge.
You can set to use favorite rave by changing the following setting to `false`:
```
useRandomRaveForRecharge: false,
```
This way the bot will use the first favorite rave.
There's a fallback for this: if no favorite rave is found, it will use a random one.

# Detox
By default the bot will perform detox if current addiction is a random value in a range of min and a max value.
You can change the threshold by changing the following setting:
```
detox: {
    threshold: {
        min: 25,
        max: 65
    }
}
```
# Single Robbery
For single robbery the first thing to do is to execute manually the robbery you want to perform.

> :warning: **DO NOT FORGET to check Full Stamina checkbox before manually perform the robbery!** The bot currently doesn't work well without checking Full Stamina checkbox!

The bot automatically will perform the currently selected single robbery and when necessary it will recharge.

# Gang Robbery
For gang robbery you must be in a gang that is performing gang robbery (virtual or not).
Then the bot will press `Accept` or `Do the score` button automatically and also will recharge when necessary.
You can also disable the press of `Do the score` button automatically (for example when robbing in a not virtual gang) by changing the following setting:
```
gangRobbery: {
    ...
    clickOnDoTheScoreButton: false
}
```

# Hunting
You have to set the max level, min and max respect for each profession in the following settings:
```
singleAssault: {
    criteriaAssault: {
        CHARACTER_BROKER: {
            maxLevel: BROKER_MAX_LEVEL,
            minRespect: BROKER_MIN_RESPECT,
            maxRespect: BROKER_MAX_RESPECT
        },
        CHARACTER_PIMP: {
            maxLevel: PIMP_MAX_LEVEL,
            minRespect: PIMP_MIN_RESPECT,
            maxRespect: PIMP_MAX_RESPECT
        },
        CHARACTER_DEALER: {
            maxLevel: DEALER_MAX_LEVEL,
            minRespect: DEALER_MIN_RESPECT,
            maxRespect: DEALER_MAX_RESPECT
        },
        CHARACTER_ROBBER: {
            maxLevel: ROBBER_MAX_LEVEL,
            minRespect: ROBBER_MIN_RESPECT,
            maxRespect: ROBBER_MAX_RESPECT
        },
        CHARACTER_BIZ: {
            maxLevel: BUSINESSMAN_MAX_LEVEL,
            minRespect: BUSINESSMAN_MIN_RESPECT,
            maxRespect: BUSINESSMAN_MAX_RESPECT
        },
        CHARACTER_HITMAN: {
            maxLevel: HTIMAN_MAX_LEVEL,
            minRespect: HITMAN_MIN_RESPECT,
            maxRespect: HITMAN_MAX_RESPECT
        },
        CHARACTER_GANGSTER: {
            maxLevel: GANGSTER_MAX_LEVEL,
            minRespect: GANGSTER_MIN_RESPECT,
            maxRespect: GANGSTER_MAX_RESPECT
        }
    },
```
> :warning: **A default configuration is already present in the bot**, but you need to review it in order to understand if it fits your need and change it accordingly.

> :warning: **All settings for all profession must be configured** 
> If you want skip/disable some profession to match criteria, I suggest to set `maxLevel` to 0 for that profession, in order to never be matched.

The `maxLevel` property, indicates the max level, for a specific profession, the bot should consider in order to match level criteria. The criteria is matched if the victim level is less or equals than `maxLevel`. For example if victim level is 8 and `maxLevel` is set to 10 the criteria will be matched. If the victim level is 10 and `maxLevel` is set to 8, the level criteria is NOT matched.

The `minRespect` and `maxRespect` properties, indicate the min and max respect, for a specific profession, the bot should consider in order to match the respect criteria. The criteria is matched if victim respect is less or equals than `maxRespect` and greater or equals than `minRespect`.

**If both level criteria and respect criteria are matched,the victim will be assaulted** (otherwise exit from rave)

Example of configuration for Robber profession:
```
CHARACTER_ROBBER: {
    maxLevel: 10,
    minRespect: 50000,
    maxRespect: 50000000
},
```
The above configuration is valid for Robber victim that:
- has a level <= 10
- respect is >= 50000
- respect is <= 50000000

**Avoid to kill some users**

You can also set a list of victims username or victims id to avoid to kill and exit instantly from the rave.
You can set usernames or ids list in the following settings:
```
victimUsernameToAvoidToKillList: ["USERNAME_1", "USERNAME_2", ... , "USERNAME_x"],
victimIdsToAvoidToKillList: ["ID_1", "ID_2", ... , "ID_X"]
```
For example to avoid to kill victim (and exit from rave) if username of victim is`foo` or `bar` or user victim with id `1234566789` is in rave:
```
victimUsernameToAvoidToKillList: ["foo", "bar"],
victimIdsToAvoidToKillList: ["123456789"]
```

# Local Development
If you want to develop locally the bot, first of all you need to install:
- `NodeJs` (>=18)

> It may be working also with other NodeJs version, but never tested

> If you already have a different version of NodeJs installed, you can use [nvm](https://github.com/nvm-sh/nvm) for POSIX-compliant shell or [nvm-windows](https://github.com/coreybutler/nvm-windows) for Windows in order to install and manage multiple NodeJs and npm version on the same system.

Then clone the repository and install all the dependencies using the command (from the project root, the folder with `pacakge.json` file):
```
npm install
```
After the installation of the dependencies, to generate the `release.js` file that is needed to run the bot in the browser, use the following command:

```
npm run build
```
and a `dist` folder will be created with file `release.js` inside

### F.A.Q.
**How do I know if my account is under "bot investigation" by The Crims crew?**
- Open the Developer tools of the browser by pressing F12 in Windows, GNU Linux (I haven't MacOS but the shortuct should be Option + ⌘ + J or search on Google)
- You should see something similar to this:
![image](https://github.com/grimaldello/the-crims-italian-bot-v2/assets/9029075/7ff95292-e9db-405b-bb4a-ea48870f20a6)

- Then, be sure to be on Tab "Network"
![image](https://github.com/grimaldello/the-crims-italian-bot-v2/assets/9029075/e2899cdc-3925-46ba-ab13-1eafe153afac)

- Do a single robbery manually and you should see new entries appear in the table:
![image](https://github.com/grimaldello/the-crims-italian-bot-v2/assets/9029075/b85de693-0e92-4464-8ae5-a054aa983e1c)

- Click on "rob"
- If you **are NOT under bot investigation** by The Crims crew, you see something similar to this:
![image](https://github.com/grimaldello/the-crims-italian-bot-v2/assets/9029075/963123df-819d-4086-84e1-f6843e57f8e1)

- If you **are under bot investigation** by The Crims crew, you see something similar to this:
![image](https://github.com/grimaldello/the-crims-italian-bot-v2/assets/9029075/dff54577-38bf-481e-b43f-4da4e37c9910)
 

**When The Crims crew start for "bot investigation" in my account?**
- Honestly, I don't know exactly. I suppose when competing for a top (both top respect and top kills) the admins start to investigate.

