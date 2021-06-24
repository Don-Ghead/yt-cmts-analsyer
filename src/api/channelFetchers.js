const config = require('../../config');
const fetch = require("node-fetch");

const CHANNEL_PARTS = {
    snippet: 'snippet',
    statistics: 'statistics',
};

/**
 * Fetches the requested parts from a video given the video ID
 * @param channelId Video ID
 * @param channelParts an array of channel parts such as snippet, statistics, etc.
 * @returns parts an object with the requested video parts
 */
const getChannelParts = async (channelId, channelParts) => {
    let responseData = undefined;
    if (channelId === "") {
        console.log('Unable to fetch channel parts, ID is empty');
    } else if (!channelParts) {
        console.log('video parts is empty');
    } else {
        const partsQueryParameter = channelParts.join(',')
        let initialResponse = await fetch(encodeURI(`https://www.googleapis.com/youtube/v3/channels?part=${partsQueryParameter}&id=${channelId}&key=${config.api_key}`));
        if (initialResponse.ok) {
            let json = await initialResponse.json();
            responseData = json.items[0];
        } else {
            console.log(`Error Status ${initialResponse.status} fetching channel parts for channel id=${channelId}`);
            throw Error('Error fetching channel parts');
        }
    }
    return responseData;
}

exports.getChannelParts = getChannelParts;
exports.CHANNEL_PARTS = CHANNEL_PARTS;