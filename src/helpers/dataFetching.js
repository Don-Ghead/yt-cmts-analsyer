const fetch = require("node-fetch");
const config = require('../../config');

async function getCommentsInfoFromResponse(id) {
    console.log(`video ID: ${id}`);
    if(id === "") {
        // Temporary, use apollo-errors to create defined errors
        throw new Error("ID can't be empty");
    } else {
        let response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&videoId=${id}&key=${config.api_key}`);
        if(response.ok) {
            const json = await response.json();
            const itemText = json.items.map((item) => {
                return item.snippet.topLevelComment.snippet.textOriginal
            });
            const numComments = itemText.length;
            return {
                commentText: itemText,
                numComments,
            };
        } else {
            // Should throw an error with the reason instead
            console.log("HTTP-Error: " + response.status);
            return []
        }
    }
}

exports.getAllCommentTextFromResponse = getCommentsInfoFromResponse;