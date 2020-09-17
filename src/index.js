const { GraphQLServer } = require('graphql-yoga');
const { getAllCommentTextFromResponse } = require('./helpers/dataFetching');

const resolvers = {
    Query: {
        info: () => `This is the API of the youtube comments analyser`,
        // Discard parent as we don't need it and destructure the ID from args param
        commentsInfoFromId: (_, {id}) => {
            //commentText.then(console.log("I print once the function returns"));
            return getAllCommentTextFromResponse(id);
        },
    }
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
});
server.start(() => console.log(`Server is running on http://localhost:4000`));