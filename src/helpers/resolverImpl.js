const {getVideoParts, VIDEO_PARTS} = require("../api/videoFetchers");
const {getChannelInfoFromId} = require("./channelHelpers");

const {enrichCommentsWithSentiment} = require("./sentimentAnalysis");
const fetch = require("node-fetch");
const config = require('../../config');

// TODO - Move URLs into a separate file with formatter to replace parameters

/**
 * Returns the following video details
 * {
 *      title
 *      channel
 *      subscribers
 *      videoViews
 *      channelViews
 *      numComments
 *      uploadDate
 * }
 * @param id Video ID
 * @returns {Promise<void>}
 */
const getVideoDetails = async (id) => {
    let videoDetails = {};
    if (id === "") {
        // Temporary, use apollo-errors to create defined errors
        throw new Error("ID can't be empty");
    } else {
        try {
            const {snippet, statistics} = await getVideoParts(id, [VIDEO_PARTS.snippet, VIDEO_PARTS.statistics])
            const channelInfo = await getChannelInfoFromId(snippet.channelId);
            videoDetails = {...channelInfo};
            videoDetails.title = snippet.title;
            videoDetails.uploadDate = snippet.publishedAt;
            videoDetails.videoViews = statistics.viewCount;
            videoDetails.numComments = statistics.commentCount;
        } catch (e) {
            // just throw the error that bubbled up for now
            throw e;
        }
    }
    return videoDetails;
}

const getAllCommentsFromId = async (id) => {
    let allComments = [];
    if (id === "") {
        // Temporary, use apollo-errors to create defined errors
        throw new Error("ID can't be empty");
    } else {
        let initialResponse = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&videoId=${id}&key=${config.api_key}`);
        if (initialResponse.ok) {
            let json = await initialResponse.json();
            allComments = allComments.concat(json.items);
            console.log(allComments.length);
            while (json.nextPageToken) {
                let successiveResponse = await fetch(`
                    https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&pageToken=${json.nextPageToken}&videoId=${id}&key=${config.api_key}
                    `);
                if (successiveResponse.ok) {
                    json = await successiveResponse.json();
                    allComments = allComments.concat(json.items)
                } else {
                    // Should throw an error with the reason instead
                    console.log("HTTP-Error in successive response: " + successiveResponse.status);
                }
            }
        } else {
            // Should throw an error with the reason instead
            console.log("HTTP-Error in initial Response: " + initialResponse.status);
            return []
        }
    }
    return allComments;
};

// This fetches all top level comments from a youtube video and
// provides some basic information about those comments including
// numComments - Number of comments
// Todo avgSentiment - The average sentiment of comments
// Todo topComments - Returns the top 5 comments (could make this a variable parameter)
// Todo commonTopics - What, if any, commonality there is between comments
const getAllCommentsInfoFromResponse = async (id) => {
    console.log(`video ID: ${id}`);
    const allRawComments = await getAllCommentsFromId(id);
    const {summary, enrichedComments} = await enrichCommentsWithSentiment(allRawComments)
    return {
        enrichedComments: enrichedComments,
        numComments: enrichedComments.length,
        sentiments: summary,
    }
}

exports.getAllCommentTextFromResponse = getAllCommentsInfoFromResponse;
exports.getVideoDetails = getVideoDetails;