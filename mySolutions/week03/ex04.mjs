"use strict";

import sqlite3 from "sqlite3";
import dayjs from "dayjs";

const DB_FILENAME = "./questions.sqlite";

const db = new sqlite3.Database(DB_FILENAME,
    (err) => {
        if (err) throw Error("could not open database! Error:\n" + err);
    });


function Question(id, text, email, date) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.date = dayjs(date);

    this.getAnswers = () =>
        new Promise((resolve, reject) => {
            db.all(
                `
            SELECT a.id, a.text, u.email, a.date, a.score FROM answer a, user u
            WHERE a.questionId = ?  AND a.authorId = u.id;
            `,
                [this.id],
                (err, rows) => {
                    if (err) reject("getAnswers: " + err);
                    else resolve(
                        rows.map(row => new Answer(row.id, row.text, row.email, row.date, row.score))
                    )
                }

            )
        }
        );

    this.addAnswer = (answer) => new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO answer (id, text, authorId, date, score, questionId) 
                SELECT  ?, ?, id, ?, ?, ? FROM user WHERE email = ?;`,
            [answer.id, answer.text, answer.date, answer.score, this.id, answer.email],
            (err) => {
                if (err) reject("addAnswer: Something went wrong! : " + err);
                else resolve("Answer added successfully");
            }
        )
    });

    this.getTop = (num) => new Promise(
        (resolve, reject) => {
            this.getAnswers()
                .then(
                    answers => resolve(answers.sort((a1, a2) => a2.score - a1.score).slice(0, num))
                )
                .catch(err => reject("getTop: " + err));
        }
    );


    this.toString = () => `Question '${this.text}' asked by '${this.email}' on ${this.date}.`;
}

function Answer(id, text, email, date, score) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.date = dayjs(date);
    this.score = score;

    this.toString = () => `'${this.text}' replied by ${this.email} on ${this.date.format('YYYY-MM-DD')} and got a score of ${this.score}`
}


function QuestionList() {

    this.getQuestion = (id) => new Promise(
        (resolve, reject) => {
            //console.log("getting id: ", id)
            db.get(
                `SELECT q.id, q.text, u.email, q.date FROM question q, user u
                WHERE q.id = ? AND u.id = q.authorId;`,
                [id],
                (err, row) => {
                    if (err) {
                        reject("getQuestion error: ", err);
                    }
                    else {
                        //console.log(row);
                        resolve(new Question(row.id, row.text, row.email, row.date));
                    }
                }
            )
        });

    this.addQuestion = (question) => new Promise(
        (resolve, reject) => {
            db.run(
                `INSERT INTO question (id, text, authorId, date)  
                    SELECT ?, ?, id ,? FROM user WHERE email = ?;`,
                [question.id, question.text, question.date.format("YYYY-MM-DD"), question.email],
                (err) => {
                    if (err) reject("addQuestion error: " + err);
                    else resolve("Question inserted successfully!");
                }
            );

        }
    );

    this.afterDate = (date) => new Promise(
        (resolve, reject) => {
            db.all(
                `SELECT q.id, q.text, u.email, q.date FROM question q, user u
            WHERE q.date >= ? AND u.id = q.authorId`,
                [dayjs(date).format("YYYY-MM-DD")],
                (err, rows) => {
                    if (err) {
                        reject("getQuestion error: ", err);
                    }
                    else {
                        //console.log(row);
                        resolve(rows.map(row => new Question(row.id, row.text, row.email, row.date)));
                    }
                }
            )
        });
}




/**
 * Tests
 */
const questionList = new QuestionList();

const newQuestion = new Question(5, 'Does it work?', 'luca.mannella@polito.it', dayjs());
console.log("adding question : ", newQuestion.toString(), "\n", await questionList.addQuestion(newQuestion));

const newAnswer1 = new Answer(5, 'Yes', 'luca.mannella@polito.it', '2024-02-15', -15, 5);
const newAnswer2 = new Answer(6, 'Not in a million year', 'guido.vanrossum@python.org', '2024-03-01', -10, 5);
console.log("adding answers:");
console.log(newAnswer1.toString(), ":", await newQuestion.addAnswer(newAnswer1));
console.log(newAnswer2.toString(), ":", await newQuestion.addAnswer(newAnswer2));

console.log("Listing questions and their answers");
for (const i of [1, 2, 5]) {
    let q = await questionList.getQuestion(i);
    console.log("", q.toString());

    let answers = await q.getAnswers();
    answers.forEach(answer => console.log("    > ", answer.toString()));

    console.log("   Top 2 answers:")
    let top2Answers = await q.getTop(2);
    top2Answers.forEach(answer => console.log("    > ", answer.toString()));
}

const afterDate = "2024-02-14";
console.log("Listing questions after date: ", afterDate);
let questionsAfterDate = await questionList.afterDate(afterDate);
questionsAfterDate.forEach(q => console.log(q.toString()));