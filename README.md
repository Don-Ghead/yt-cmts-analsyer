# GraphQL API for Youtube Rundown

An API which at a high level takes a youtube video ID and returns condensed/enriched information. 
For now the primary focus is on the comments of the video which are enriched with some **basic** sentiment analysis.
However it also includes a lot of the other information you might expect to see to give some better context.

This may be extended in the future to include a page for the whole Youtube Channel but for this version we are focusing
on the video/comments.

## Commands

 - `yarn start` to just run without scanning for changes
 - `yarn watch` to run and watch for changes using nodemon
 - `yarn test` to run the tests (when we actually have some)

## Other information

This uses GraphQL-Yoga for building the GQL API and node-nlp for doing the sentiment analysis. I would like to use a 
trained Machine Learning implementation for the NLP side of it in the future but this is a good option for getting the whole 
project working together for now. 

## Implementation Thoughts

The sentiment analysis part of this currently gets a score for each comment and then assigns it a friendly value to indicate 
what we think is the sentiment (clearly positive, negative, etc.). Another way of interpreting this data may be to average 
the scores and show an overall sentiment. Both would be good to interpret the data. 