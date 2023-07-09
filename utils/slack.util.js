const { WebClient } = require('@slack/web-api');

const options = {};
const web = new WebClient(process.env.SLACK_TOKEN, options);

const sendSlackMessage = async (message, channel = null) => {
    return new Promise(async (resolve, reject) => {
        const channelId = channel || process.env.SLACK_CHANNEL_ID;
        try {
            const resp = await web.chat.postMessage({
                blocks: message,
                channel: channelId,
            });
            return resolve(true);
        } catch (error) {
            const errorMessage = error?.data?.error;
            if (errorMessage == 'not_in_channel') {
                await joinSlackChannel(channelId, message);
            }
            return resolve(true);
        }
    });
};

const joinSlackChannel = (channel, message = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            const resp = await web.conversations.join({
                channel: channel,
            });
            if (message) {
                await sendSlackMessage(message, channel);
            }
            return resolve(true);
        } catch (error) {
            return resolve(true);
        }
    });
};

module.exports = {
    sendSlackMessage,
    joinSlackChannel
};