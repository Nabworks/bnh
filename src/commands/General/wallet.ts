import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'wallet',
            description: "Displays User's wallet",
            category: 'general',
            usage: `${client.config.prefix}wallet (@tag)`,
            aliases: ['wal'],
            baseXp: 10
        })
    }
    
run = async (M: ISimplifiedMessage): Promise<void> => {
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        const user = M.mentioned[0] ? M.mentioned[0] : M.sender.jid
        let username = user === M.sender.jid ? M.sender.username : 'Your'
        if (!username) {
            // const contact = this.client.getContact(user)
            // username = contact.notify || contact.vname || contact.name || user.split('@')[0]
            username = user.split('@')[0]
        }
        return void (await M.reply(`${username} you have : ${(await this.client.getUser(user)).Wallet || 0} wallet`))
