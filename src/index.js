const {getVideoDetails} = require("./helpers/dataFetching");
const {GraphQLServer} = require('graphql-yoga');
const {getAllCommentTextFromResponse} = require('./helpers/dataFetching');

const resolvers = {
    Query: {
        // Discard parent as we don't need it and destructure the ID from args param
        topLevelCommentsInfoFromId: (_, {id}) => {
            //commentText.then(console.log("I print once the function returns"));
            return getAllCommentTextFromResponse(id);
        },

        videoInfoFromId: (_, {id}) => {
            return getVideoDetails(id);
        }
    }
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
});
server.start(() => console.log(`Server is running on http://localhost:4000`));