const { SentimentAnalyzer } = require('node-nlp')

const sentimentEn = new SentimentAnalyzer({ language: 'en'});


const CLEARLY_POSITIVE = {text: 'Clearly Positive', sentimentScore: 0.7, value: 6 };
const CLEARLY_NEGATIVE = {text: 'Clearly Negative', sentimentScore: -0.6, value: 1 };
// Not many words
const NEUTRAL = {text: 'Neutral', value: 3 };
// Many words
const MIXED = {text: 'Mixed Emotions', value: 4 };
const SLIGHTLY_POSITIVE = {text: 'Slightly Positive', sentimentScore: 0.15, value: 5 };
const SLIGHTLY_NEGATIVE = {text: 'Slightly Negative', sentimentScore: -0.15, value: 2 };
const ALL_SENTIMENTS = {
    CLEARLY_POSITIVE,
    CLEARLY_NEGATIVE,
    NEUTRAL,
    MIXED,
    SLIGHTLY_POSITIVE,
    SLIGHTLY_NEGATIVE
}

const manyWords = 30;

const between = (x, min, max) => {
    return x >= min && x <= max;
}

// { score: 0.313,
//   numWords: 3,
//   numHits: 1,
//   comparative: 0.10433333333333333,
//   type: 'senticon',
//   language: 'en' }
const determineSentiment = async (comment) => {
    let result;
    try {
        result = await sentimentEn.getSentiment(comment.snippet.topLevelComment.snippet.textOriginal);
    } catch (err) {
        console.log(err)
    }
    let sentiment = {
        value: 0,
        text: 'Undetermined'
    }

    switch(true)
    {
        case (result.score < CLEARLY_NEGATIVE.sentimentScore):
            sentiment = CLEARLY_NEGATIVE;
            break;
        case between(result.score, CLEARLY_NEGATIVE.sentimentScore, SLIGHTLY_NEGATIVE.sentimentScore):
            sentiment = SLIGHTLY_NEGATIVE;
            break;
        case between(result.score, SLIGHTLY_NEGATIVE.sentimentScore, SLIGHTLY_POSITIVE.sentimentScore):
            if(result.numWords > manyWords) {
                sentiment = MIXED;
            } else {
                sentiment = NEUTRAL;
            }
            break;
        case between(result.score, SLIGHTLY_POSITIVE.sentimentScore, CLEARLY_POSITIVE.sentimentScore):
            sentiment = SLIGHTLY_POSITIVE;
            break;
        case (result.score > CLEARLY_POSITIVE.sentimentScore):
            sentiment = CLEARLY_POSITIVE;
            break;
        default:
            console.log(`Analysed comment with undetermined sentiment: ${comment}`)
            console.log(result)
            break;
    }

    console.log(`Gave sentiment of "${ALL_SENTIMENTS.find()}" to comment: ${comment} `);
    return sentiment;
}

const incrementSentiment = (value, sentimentCount) => {
    switch(value) {
        case CLEARLY_POSITIVE.value:
            sentimentCount.clearlyPositive++;
            break;
        case SLIGHTLY_POSITIVE.value:
            sentimentCount.slightlyPositive++;
            break;
        case MIXED.value:
            sentimentCount.mixed++;
            break;
        case NEUTRAL.value:
            sentimentCount.neutral++;
            break;
        case SLIGHTLY_NEGATIVE.value:
            sentimentCount.slightlyNegative++;
            break;
        case CLEARLY_NEGATIVE.value:
            sentimentCount.clearlyNegative++;
            break;
    }
}

const enrichCommentsWithSentiment = (comments) => {
    const sentimentCount = {
        clearlyPositive: 0,
        slightlyPositive: 0,
        mixed: 0,
        neutral: 0,
        slightlyNegative: 0,
        clearlyNegative: 0,
    }
    const enrichedComments = comments.map(comment => {
        const sentiment = determineSentiment(comment);
        incrementSentiment(sentiment.value, sentimentCount)
        return {
            comment,
            sentimentText: sentiment.text,
        }
    })
    return {
        summary: sentimentCount,
        enrichedComments: enrichedComments,
    }
}

module.exports = {enrichCommentsWithSentiment}