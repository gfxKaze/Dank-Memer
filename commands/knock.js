exports.run = async function (Memer, msg) {
	if (!msg.member.voiceState.channelID) {
		await msg.addReaction('❌')
		return Memer.reply('join a voice channel fam', msg)
	}

	if (!Memer.client.getChannel(msg.member.voiceState.channelID).permissionsOf(Memer.client.user.id).has('voiceConnect') ||
		!Memer.client.getChannel(msg.member.voiceState.channelID).permissionsOf(Memer.client.user.id).has('voiceSpeak')) {
		return Memer.reply('Well shit, there was a permission error! Make sure I have `connect` and `speak` so I can do this shit!', msg)
	}
	if (!Memer.client.voiceConnections.get(msg.channel.guild.id)) {
		msg.addReaction('👍')
		const conn = await Memer.client.joinVoiceChannel(msg.member.voiceState.channelID)
		conn.play('./assets/knock.opus')
		conn.once('end', async () => {
			await Memer.client.leaveVoiceChannel(msg.member.voiceState.channelID)
			if (Memer.client.voiceConnections.get(msg.channel.guild.id)) {
				await Memer.client.voiceConnections.get(msg.channel.guild.id).disconnect()
				await Memer.client.voiceConnections.get(msg.channel.guild.id)._destroy()
				await Memer.client.voiceConnections.remove(Memer.client.voiceConnections.get(msg.guild.id))
			}
		})
	} else {
		await msg.addReaction('❌')
		Memer.reply('Another sound is already playing, douche', msg)
	}

}