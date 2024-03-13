// Exercise 1: Better Scores
"use strict";

// Define an array with all the scores you received in chronological order. For the moment:
// Embed the scores directly in the source code.
// Ignore the question, answer, and date that generated the score.
const scores = [5, 8, -2, -9, 4, 5, -2, 9];
scores[0] = 6;
scores.push(-9);
console.log(`Initial scores: ${scores}`);
// Duplicate the array, but:

// Eliminate all negative scores (call NN the number of negative scores that are deleted).
let scores_modified = scores.filter(score => score >= 0);
const NN = scores.length - scores_modified.length;
console.log(`Positive scores: ${scores_modified}, # deleted negative numbers: ${NN}`);
// Eliminate the two lowest-ranking scores.
if (scores_modified.length <= 2) {
    scores_modified = [];
}
else {
    let [low0, low1] = scores_modified.slice(0, 2); //set two values to first two values of array
    if (low0 < low1) {
        [low0, low1] = [low1, low0]; //set right value less than left value
    }
    for (let score of scores_modified.slice(2)) { //from 3rd element
        if (score < low0) {
            if (score > low1) { //if less than larger value but greater than smaller value
                low0 = score;   //set score as larger value
            }
            else if (score < low0) { //if less than both values,
                [low0, low1] = [low1, score]; //set old smaller value as larger value and set score as smaller value
            }
        }
        console.log(`${score}: Two lowest ranks: ${[low0, low1]}`)
    }
    console.log(`Two lowest ranks: ${[low0, low1]}`)
    scores_modified = scores_modified.filter(score => score != low0 && score != low1);
}
console.log(`Positive scores with 2 low ranking removed: ${scores_modified}`);
// Add NN+2 new scores, at the end of the array, with a value equal to the (rounded) average of the existing scores.
let modified_scores_avg_rounded = 0;
if (scores_modified.length) {
    for (let score of scores_modified) {
        modified_scores_avg_rounded += score;
    }
    modified_scores_avg_rounded = Math.round(modified_scores_avg_rounded / scores_modified.length);
}
for (let i = 1; i <= NN + 2; ++i) {
    scores_modified.push(modified_scores_avg_rounded);
}
console.log(`modified scores rounded average: ${modified_scores_avg_rounded}`);
console.log(`With (${NN} + 2) = ${NN + 2} number of rounded average ${modified_scores_avg_rounded} added at the end of modified scores: ${scores_modified} `);

// Print both arrays, comparing the scores before and after the "improvement," and showing the averages in both cases.

const scores_avg_rounded =
    Math.round(
        scores.reduce(
            (accumulator, currentValue) => accumulator + currentValue
        )
        / scores.length
    );
modified_scores_avg_rounded =
    Math.round(
        scores_modified.reduce(
            (accumulator, currentValue) => accumulator + currentValue
        )
        / scores.length
    );
console.log(`original scores: ${scores} with avg: ${scores_avg_rounded}`);
console.log(`modified scores: ${scores_modified} with avg: ${modified_scores_avg_rounded}`)