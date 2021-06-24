const {getChannelParts} = require("../api/channelFetchers");
const {VIDEO_PARTS} = require("../api/videoFetchers");
const fetch = require("node-fetch");

const getChannelInfoFromId = async (channelId) => {
    const {snippet, statistics} = await getChannelParts(channelId, [VIDEO_PARTS.snippet, VIDEO_PARTS.statistics])
    return {
        subscribers: statistics.subscriberCount,
        channelViews: statistics.viewCount,
        channel: {
            name: snippet.title,
            url: `https://www.youtube.com/channel/${channelId}`
        },
    }
}

exports.getChannelInfoFromId = getChannelInfoFromId;