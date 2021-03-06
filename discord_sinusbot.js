/**
 * Forum:  
 * GitHub: https://github.com/irgendwr/sinusbot-scripts
 */

registerPlugin({
    name: 'Discord SinusBot',
    version: '1.0.0',
    description: 'Useful commands for the official SinusBot Discord server.',
    author: 'Jonas Bögle (irgendwr)',
    engine: '>= 1.0.0',
    backends: ['discord'],
    requiredModules: ['http', 'discord-dangerous'],
    vars: [
        {
            name: 'api_forum',
            title: 'Forum API URL',
            type: 'string',
            placeholder: 'https://forum.example.com/foobar?id=%ID%'
        },
    ]
}, (_, config, meta) => {
    const event = require('event')
    const engine = require('engine')
    const backend = require('backend')
    const http = require('http')

    engine.log(`Loaded ${meta.name} v${meta.version} by ${meta.author}.`)

    const urlPattern = /^https:\/\/forum\.sinusbot\.com\/members\/(?:.*\.)?(\d+)\/(?:#.*)?$/;
    const tagPattern = /^ ?<@!?\d{18}> ?$/;

    event.on('load', () => {
        const command = require('command')
        if (!command) {
            engine.log('command.js library not found! Please download command.js to your scripts folder and restart the SinusBot, otherwise this script will not work.');
            engine.log('command.js can be found here: https://github.com/Multivit4min/Sinusbot-Command/blob/master/command.js');
            return;
        }

        command.createCommand('needinfo')
        .forcePrefix('!')
        .addArgument(command.createArgument('string').setName('user').optional())
        .help('Lists required information that we need to be able to help')
        .manual('Lists required information that we need to be able to help.')
        .exec((client, args, /** @type {(message: string)=>void} */reply, ev) => {
            let pre = 'Please **send us all of the information listed below**, depending on your OS.\n'
            if (tagPattern.exec(args.user) != null) {
                pre = `Hi ${args.user}! ` + pre
            }
            reply(pre + `
> :penguin: **Linux**
1) Output of the diagnostic script: <https://forum.sinusbot.com/threads/diagscript.831/>
2) Instance log / SinusBot log (set \`LogLevel = 10\` in your \`config.ini\` before)
Share these via <https://pastebin.com> to reduce spam.

> :snail: **Windows**
1) OS (operating system), e.g. *Windows 10 64bit*
2) SinusBot version (<https://sinusbot.github.io/docs/faq/general/#what-is-my-version>)
3) TeamSpeak Client version
4) Instance log / SinusBot log (set \`LogLevel = 10\` in your \`config.ini\` before)
**Share these via <https://pastebin.com>** to reduce spam.

*This automated message was triggered by ${client.getURL()}*`)
            // try to delete original message to reduce spam
            ev.message.delete()
        })

        command.createCommand('needinfo-linux')
        .alias('needinfolinux', 'linuxinfo', 'infolinux')
        .forcePrefix('!')
        .addArgument(command.createArgument('string').setName('user').optional())
        .help('Lists required information that we need to be able to help')
        .manual('Lists required information that we need to be able to help.')
        .exec((client, args, /** @type {(message: string)=>void} */reply, ev) => {
            let pre = 'Please **send us all of the information listed below**.'
            if (tagPattern.exec(args.user) != null) {
                pre = `Hi ${args.user}! ` + pre
            }
            reply(pre + ` *This assumes you're using Linux*

1) **Send us the output of the diagnostic script**:
\`\`\`bash
# before running the diag script you might need to install depencencies
apt-get install bc binutils coreutils lsb-release util-linux net-tools curl
# change to your path:
cd /opt/sinusbot/
# execute with root privileges, sudo may be required:
bash <(wget -O - https://raw.githubusercontent.com/patschi/sinusbot-tools/master/tools/diagSinusbot.sh)
\`\`\`
2) And the **Instance log / SinusBot log** (set \`LogLevel = 10\` in your \`config.ini\` before)
**Share these via <https://pastebin.com>** to reduce spam.

*This automated message was triggered by ${client.getURL()}*`)
            // try to delete original message to reduce spam
            ev.message.delete()
        })

        command.createCommand('needinfo-windows')
        .alias('needinfo-win', 'needinfowindows', 'needinfowin', 'windowsinfo', 'wininfo', 'infowin')
        .forcePrefix('!')
        .addArgument(command.createArgument('string').setName('user').optional())
        .help('Lists required information that we need to be able to help')
        .manual('Lists required information that we need to be able to help.')
        .exec((client, args, /** @type {(message: string)=>void} */reply, ev) => {
            let pre = 'Please **send us all of the information listed below**.'
            if (tagPattern.exec(args.user) != null) {
                pre = `Hi ${args.user}! ` + pre
            }
            reply(pre + ` *This assumes you're using Windows*

1) OS (operating system), e.g. *Windows 10 64bit*
2) SinusBot version (<https://sinusbot.github.io/docs/faq/general/#what-is-my-version>)
3) TeamSpeak Client version
4) Instance log / SinusBot log (set \`LogLevel = 10\` in your \`config.ini\` before)
**Share the logs via <https://pastebin.com> to reduce spam.**

*This automated message was triggered by ${client.getURL()}*`)
            // try to delete original message to reduce spam
            ev.message.delete()
        })

        command.createCommand('diagscript')
        .forcePrefix('!')
        .help('SinusBot Documentation: diagscript')
        .manual('SinusBot Documentation: diagscript')
        .exec((client, args, /** @type {(message: string)=>void} */reply) => {
            reply(`\`\`\`bash
# before running the diag script you might need to install depencencies
apt-get install bc binutils coreutils lsb-release util-linux net-tools curl
# change to your path:
cd /opt/sinusbot/
# execute with root privileges, sudo may be required:
bash <(wget -O - https://raw.githubusercontent.com/patschi/sinusbot-tools/master/tools/diagSinusbot.sh)
\`\`\``)
        })
        
        command.createCommand('install')
        .forcePrefix('!')
        .help('SinusBot Documentation: install')
        .manual('SinusBot Documentation: install')
        .exec((client, args, /** @type {(message: string)=>void} */reply) => {
            reply(`Linux: <https://sinusbot.github.io/docs/installation/linux/>
Windows: <https://sinusbot.github.io/docs/installation/windows/>
Docker: <https://sinusbot.github.io/docs/installation/docker/>`)
        })

        command.createCommand('youtube-dl')
        .alias('ytdldoc', 'ytdldocs')
        .forcePrefix('!')
        .help('SinusBot Documentation: youtube-dl')
        .manual('SinusBot Documentation: youtube-dl')
        .exec((client, args, /** @type {(message: string)=>void} */reply) => {
            reply(`<https://sinusbot.github.io/docs/youtube-dl/>`)
        })

        command.createCommand('docs')
        .forcePrefix('!')
        .help('SinusBot Documentation')
        .manual('SinusBot Documentation')
        .exec((client, args, /** @type {(message: string)=>void} */reply) => {
            reply(`SinusBot Documentation: <https://sinusbot.github.io/docs/>`)
        })

        command.createCommand('scripts')
        .alias('scripting')
        .forcePrefix('!')
        .help('SinusBot Documentation: Scripts')
        .manual('SinusBot Documentation: Scripts')
        .exec((client, args, /** @type {(message: string)=>void} */reply) => {
            reply(`About writing scripts: <https://sinusbot.github.io/docs/scripts/>
Scripting Documentation: <https://sinusbot.github.io/scripting-docs/>
Scripts: <https://forum.sinusbot.com/resources/categories/scripts.2/>`)
        })

        command.createCommand('license')
        .alias('lic')
        .forcePrefix('!')
        .help('SinusBot Documentation: Licenses')
        .manual('SinusBot Documentation: Licenses')
        .exec((client, args, /** @type {(message: string)=>void} */reply) => {
            reply(`Information about Licenses: <https://sinusbot.github.io/docs/licenses/>`)
        })

        command.createCommand('3rdparty')
        .alias('noscriptsupport', 'scriptsupport')
        .forcePrefix('!')
        .help('Reminder: no 3rd party support')
        .manual('Reminder: We don\'t offer support for 3rd-party scripts.')
        .exec((client, args, /** @type {(message: string)=>void} */reply) => {
            reply(`We don't offer support for 3rd-party scripts. Ask for help in the discussions thread of the script (in the forum) instead.`)
        })

        command.createCommand('installer-error')
        .alias('installererror')
        .forcePrefix('!')
        .help('Reminder: Installer Script support in forum')
        .manual('Reminder: Issues with the Installer Script should be posted in it\'s forum thread.')
        .exec((client, args, /** @type {(message: string)=>void} */reply) => {
            reply(`Issues with the Installer Script should be posted in it's forum thread: <https://forum.sinusbot.com/threads/sinusbot-installer-script.1200/page-999>`)
        })

        command.createCommand('roles')
        .alias('groups')
        .forcePrefix('!')
        .addArgument(command.createArgument('string').setName('url'))
        .help('Gives you the groups from the SinusBot Forum')
        .manual('Gives you the groups from the SinusBot Forum.\nThis only works if you set your full discord username (for example: `irgendwr#7476`) in your forum settings: <https://forum.sinusbot.com/account/account-details>.')
        .exec((/** @type {Client} */client, /** @type {object} */args, /** @type {(message: string)=>void} */reply) => {
            if (!args.url) {
                getUser(client).then(user => {
                    const tag = user.username + '#' + user.discriminator
                    reply(`To get the groups from your forum account you need to:
1) Set your full discord username \`${tag}\` in your forum settings: <https://forum.sinusbot.com/account/account-details>
2) Write \`!roles <link to your profile>\` in <#534460311575461940>`)
                })
                return;
            }

            let matches = urlPattern.exec(args.url)
            if (!matches || matches.length < 2) {
                reply('That\'s not a valid url.\nExample of a valid url: `https://forum.sinusbot.com/members/irgendwr.1213/`')
                return;
            }

            let id = matches[1];
            http.simpleRequest({
                'method': 'GET',
                'url': config.api_forum.replace(/%ID%/gi, encodeURIComponent(id)),
                'timeout': 6000,
            }, function (error, response) {
                if (error) {
                    engine.log("Error: " + error);
                    reply('Error: API error #1 :sad:');
                    return;
                }
                
                if (response.statusCode != 200) {
                    engine.log("HTTP Error: " + response.status);
                    reply('Error: API error #2 :sad:');
                    return;
                }
                
                // parse JSON response
                var res;
                try {
                    res = JSON.parse(response.data.toString());
                } catch (err) {
                    engine.log(err.message);
                }
                
                // check if parsing was successfull
                if (res === undefined) {
                    engine.log("Invalid JSON.");
                    reply('Error: invalid response :sad:');
                    return;
                }
                
                if (!res.success) {
                    reply('Invalid user.')
                    return;
                }

                getUser(client).then(user => {
                    const tag = user.username + '#' + user.discriminator
                    if (!res.discordID) {
                        reply('No Discord ID found.\nPlease set your full discord username `'+tag+'` in your forum settings: <https://forum.sinusbot.com/account/account-details>')
                        return;
                    }
                    
                    if (!tag || tag !== res.discordID) {
                        reply('Your username `'+tag+'` does not match `'+res.discordID+'`.')
                        return;
                    }

                    if (res.groups.length === 0) {
                        reply('You don\'t have any groups in the forum :hatching_chick:')
                    }

                    engine.log('roles: ' + res.groups.join(', '))

                    let roles = [];
                    if (res.groups.includes('Developer')) {
                        roles.push(':floppy_disk: Developer')
                        //addRole(client, '454967235157426178')
                    }
                    if (res.groups.includes('Moderating')) {
                        roles.push(':hammer: Moderator')
                        //addRole(client, '531495313291083802')
                    }
                    if (res.groups.includes('VIP')) {
                        roles.push(':star: VIP')
                        addRole(client, '454965825317896193')
                    }
                    if (res.groups.includes('Tier III')) {
                        roles.push(':heart: Tier III')
                        addRole(client, '681228347065499899')
                    }
                    if (res.groups.includes('Tier II')) {
                        roles.push(':heart: Tier II')
                        addRole(client, '681228203096145996')
                    }
                    if (res.groups.includes('Tier I')) {
                        roles.push(':heart: Tier I')
                        addRole(client, '624933507260612608')
                    }
                    if (res.groups.includes('Donor++')) {
                        roles.push(':heart: Donor++')
                        addRole(client, '454967925544321034')
                    }
                    if (res.groups.includes('Donor')) {
                        roles.push(':heart: Donor')
                        addRole(client, '452456955391377409')
                    }
                    if (res.groups.includes('Contributor')) {
                        roles.push('Contributor')
                        addRole(client, '472340215113973772')
                    }
                    if (res.groups.includes('Insider')) {
                        roles.push('Insider')
                        addRole(client, '452456498300452877')
                    }

                    const len = roles.length
                    if (len !== 0) {
                        reply(`Welcome ${client.getURL()}! :slight_smile:
Added ${len} role${len == 1 ? '' : 's'} from account ${id}:\n${roles.join('\n')}`)
                        engine.log(`${client.nick()} (${client.uid()}) synced roles from ${id}: ${roles.join()}`)
                    } else {
                        reply('You don\'t have any groups in the forum that can be snyced :confused:')
                    }
                })
            });
        })
    })

    /**
     * Gets a user object.
     * @param {Client} client Client
     * @return {Promise<object>}
     */
    function getUser(client) {
        const id = client.uid().split('/')[1]
        return discord('GET', `/users/${id}`, null, true)
    }

    /**
     * Gets a user object.
     * @param {Client} client Client
     * @param {string} roleID Role ID
     * @return {Promise<object>}
     */
    function addRole(client, roleID) {
        const ids = client.uid().split('/')
        return discord('PUT', `/guilds/${ids[0]}/members/${ids[1]}/roles/${roleID}`, null, false)
    }

    /**
     * Executes a discord API call
     * @param {string} method http method
     * @param {string} path path
     * @param {object} [data] json data
     * @param {boolean} [repsonse] `true` if you're expecting a json response, `false` otherwise
     * @return {Promise<object>}
     * @author Jonas Bögle
     * @license MIT
     */
    function discord(method, path, data, repsonse=true) {
        //engine.log(`${method} ${path}`)

        return new Promise((resolve, reject) => {
            backend.extended().rawCommand(method, path, data, (err, data) => {
                if (err) return reject(err)
                if (repsonse) {
                    let res
                    try {
                        res = JSON.parse(data)
                    } catch (err) {
                        return reject(err)
                    }
                    
                    if (res === undefined) {
                        return reject('Invalid Response')
                    }

                    return resolve(res)
                }
                resolve()
            })
        })
    }
})
