const { SentimentAnalyzer } = require('node-nlp')

const sentimentEn = new SentimentAnalyzer({ language: 'en'});


const CLEARLY_POSITIVE = {text: 'Clearly Positive', range: 0.7};
const CLEARLY_NEGATIVE = {text: 'Clearly Negative', value: -0.6};
// Not many words
const NEUTRAL = 'Neutral';
// Many words
const MIXED = 'Mixed Emotions';
const SLIGHTLY_POSITIVE = {text: 'Slightly Positive', value: 0.15};
const SLIGHTLY_NEGATIVE = {text: 'Slightly Negative', value: -0.15};
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
    const result = await sentimentEn.getSentiment(comment);
    let sentiment = 'undetermined';

    switch(true)
    {
        case (result.score < CLEARLY_NEGATIVE.value):
            sentiment = CLEARLY_NEGATIVE.text;
            break;
        case between(result.score, CLEARLY_NEGATIVE.value, SLIGHTLY_NEGATIVE.value):
            sentiment = SLIGHTLY_NEGATIVE.value
            break;
        case between(result.score, SLIGHTLY_NEGATIVE.value, SLIGHTLY_POSITIVE.value):
            if(result.numWords > manyWords) {
                sentiment = MIXED;
            } else {
                sentiment = NEUTRAL;
            }
            break;
        case between(result.score, SLIGHTLY_POSITIVE.value, CLEARLY_POSITIVE.value):
            sentiment = SLIGHTLY_POSITIVE.value;
            break;
        case (result.score > CLEARLY_POSITIVE.value):
            sentiment = CLEARLY_POSITIVE.value;
            break;
        default:
            console.log(`Analysed comment with undetermined sentiment: ${comment}`)
            console.log(result)
            break;
    }

    console.log(`Gave sentiment of "${sentiment}" to comment: ${comment} `);
    return result.score;
}