const {enrichCommentsWithSentiment} = require("./sentimentAnalysis");
const fetch = require("node-fetch");
const config = require('../../config');

const getVideoDetails = async (id) => {
    const videoDetails = {};
    if (id === "") {
        // Temporary, use apollo-errors to create defined errors
        throw new Error("ID can't be empty");
    } else {
        let initialResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${config.api_key}`);
        if (initialResponse.ok) {
            let json = await initialResponse.json();
            console.log(json.items[0].snippet.title);
            videoDetails.title = json.items[0].snippet.title;
        } else {
            // Should throw an error with the reason instead
            console.log("HTTP-Error in initial Response: " + initialResponse.status);
            return []
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
                if(successiveResponse.ok) {
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
    const { summary, enrichedComments } = await enrichCommentsWithSentiment(allRawComments)
    return {
        enrichedComments: enrichedComments,
        numComments: enrichedComments.length,
        sentiments: summary,
    }
}

exports.getAllCommentTextFromResponse = getAllCommentsInfoFromResponse;
exports.getVideoDetails = getVideoDetails;