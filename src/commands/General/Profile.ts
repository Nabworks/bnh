import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import request from '../../lib/request'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'profile',
            description: 'Displays user-profile 🌟',
            category: 'general',
            usage: `${client.config.prefix}profile (@tag)`,
            aliases: ['p'],
            baseXp: 30
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        const user = M.mentioned[0] ? M.mentioned[0] : M.sender.jid
        let username = user === M.sender.jid ? M.sender.username : ''
        if (!username) {
            const contact = this.client.getContact(user)
            username = contact.notify || contact.vname || contact.name || user.split('@')[0]
        }
        let pfp: string
        try {
            pfp = await this.client.getProfilePicture(user)
        } catch (err) {
            M.reply(`${username} doesnt have a profile pic`)
            pfp =
                'https://uploader.hardianto.xyz/uploads/recfile-1633897234298.jpg'
        }
        const data = await this.client.getUser(user)
        await M.reply(
            await request.buffer(
                pfp ||
                    'https://uploader.hardianto.xyz/uploads/recfile-1633897234298.jpg'
            ),
            MessageType.image,
            undefined,
            undefined,
            `🎋 *Username: ${username}*\n\n🎫 *Bio: ${
                (await this.client.getStatus(user)).status || 'None'
            }*\n\n🌟 *XP: ${data.Xp || 0}*\n\n👑 *Admin: ${
                M.groupMetadata?.admins?.includes(user) || false
            }*\n\n *🏴‍☠️Ban: ${data.ban || false}*`
        )
    }
}
