const config = require('../../config');
const fetch = require("node-fetch");

const VIDEO_PARTS = {
    snippet: 'snippet',
    statistics: 'statistics',
};

/**
 * Fetches the requested parts from a video given the video ID
 * @param videoId Video ID
 * @param videoParts an array of video parts such as snippet, statistics, etc.
 * @returns parts an object with the requested video parts
 */
const getVideoParts = async (videoId, videoParts) => {
    let responseData = undefined;
    if (videoId === "") {
        console.log('Unable to fetch video parts, ID is empty');
    } else if (!videoParts) {
        console.log('video parts is empty');
    } else {
        const partsQueryParameter = videoParts.join(',')
        let initialResponse = await fetch(encodeURI(`https://www.googleapis.com/youtube/v3/videos?part=${partsQueryParameter}&id=${videoId}&key=${config.api_key}`));
        if (initialResponse.ok) {
            let json = await initialResponse.json();
            responseData = json.items[0];
        } else {
            console.log(`Error Status ${initialResponse.status} fetching video parts for video id=${videoId}`);
            throw Error('Error fetching video parts');
        }
    }
    return responseData;
}

exports.getVideoParts = getVideoParts;
exports.VIDEO_PARTS = VIDEO_PARTS;