// Imports
const data = require("./data.json");
const dpaint = require("@dmmdjs/dmmd.js/dpaint/exports.js");
const fs = require("fs");
const readline = require("readline");

// Variables
let index = 0;
let points = 0;
let rInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let record = fs.createWriteStream(`records/${Date.now()}.txt`);

// Execute
quiz();

// Functions
function quiz() {
    index++;
    console.clear();
    let set = data[Math.floor(Math.random() * data.length)], status = null;
    let { question, answer } = fetch(set);
    console.log(dpaint.bold(`Question #${index} | Points: ${points}`));
    console.log(question);
    rInterface.question(`> `, a => {
        let r = a.toLowerCase();
        if(r === "exit") {
            record.end();
            console.log(color("Exiting!", null));
            process.exit();
        }
        else if(r === "skip") {
            status = "Skipped";
            points--;
        }
        else if(r === answer.toLowerCase()) {
            status = "Correct";
            points++;
        }
        else {
            status = "Incorrect";
            points--;
        };
        console.log(color(`${status}! The correct answer is ${answer}!`, status));
        record.write(`Question #${index} | Points: ${points} | ${status}\nQ: ${question}\nA: ${a} | ${answer}\n\n`);
        setTimeout(() => quiz(), 3000);
    });
};

function color(string, status) {
    switch(status) {
        case "Correct": return dpaint.green(string);
        case "Incorrect": return dpaint.red(string);
        case "Skipped": return dpaint.yellow(string);
        default: return dpaint.gray(string);
    };
};

function fetch(set) {
    switch(Math.floor(Math.random() * 3)) {
        case 0: {
            if(set.location.length === 0) return fetch(set);
            return {
                question: `What is the name of ${set.type} between ${set.location.map(l => l.name).join(" & ")}?`,
                answer: set.name
            };
        };
        case 1: {
            if(set.type === null) return fetch(set);
            return {
                question: `What type of ${set.category} is ${set.name}?`,
                answer: set.type
            };
        };
        case 2: {
            if(set.owners.length === 0) return fetch(set);
            return {
                question: `Who or what owns ${set.name}? (Seperated by comma)`,
                answer: set.owners.join(", ")
            };
        };
    };
};