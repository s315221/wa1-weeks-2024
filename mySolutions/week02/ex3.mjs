"use strict";
import dayjs from "dayjs";

function Answer(response, username, score, date) {
    this.response = response;
    this.username = username;
    this.score = score;
    this.date = date;
}

function Question(question, username, date, answers = []) {
    this.question = question;
    this.username = username;
    this.date = date;
    this.answers = answers;

    this.add = (answer) => answers.push(answer);
    this.find = (username) => answers.filter(answer => answer.username === username);
    this.afterDate = (date) => answers.filter(answer => dayjs(answer.date).isAfter(date)|| dayjs(answer.date).isSame(date));
    this.listByDate = () => [...answers].sort((a, b) => dayjs(a.date).diff(b.date));
    this.listByScore = () => [...answers].sort((a, b) => a.score - b.score);
}

//tests
const q1 = new Question('Are you happy?', 'fulvio', dayjs('2024-03-12'));

const a1 = new Answer('Yes', 'fulvio', 5, dayjs('2024-03-12'))
q1.add(a1)

q1.add(new Answer('Maybe', 'luigi', 0, dayjs()))
q1.add(new Answer('No', 'fulvio', -2, dayjs('2024-03-12')))
q1.add(new Answer('Undecided', 'luigi', 0, dayjs()))

console.log("Find luigi:");
console.log(q1.find('luigi'));

console.log("after 2024-03-12:");
console.log(q1.afterDate(dayjs('2024-03-12')));

console.log("list by Date");
console.log(q1.listByDate());

console.log("list by score");
console.log(q1.listByScore());