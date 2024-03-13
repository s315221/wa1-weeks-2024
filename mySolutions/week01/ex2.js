"use strict";
// For instance: "Luigi De Russis, Luca Mannella, Fulvio Corno, Juan Pablo Saenz Moreno, Luca Pezzolla"
const users = "Luigi De   Russis,Luca Mannella, Fulvio Corno,  Juan      Pablo Saenz Moreno , Luca Pezzolla"
console.log(`user list:\n`, users);

//  Parse the string and create an array containing one name per array position.
//  - Beware: no extra spaces should be present.
const userArray =
    users.
        split(",") // split user list to names using , as separator
        .map(name => // for each splitted name
            name
                .trim() // remove leading and trailing whitespaces
                .replace(/\s+/g, " ") //replace duplicate spaces in between words with single space
        );
console.log("parsed as array:\n", userArray);

// Create a second array by computing the acronyms of the people as the initial letters of the name. Acronyms should be in all-capital letters.
const acronyms = userArray.map(user =>// for each fullname,
    user.split(" ") // split full name into name parts using space as separator
        .map(namePart => // for each name part,
            namePart[0].toLocaleUpperCase()) //  extract first letter and capitalize
        .join("") // join extracted first letters to a single string with no separator
);
console.log("Acronym array:\n", acronyms);

// Print the resulting list of acronyms and the full names.
//  Extra: in alphabetical order of acronym.
console.log("parsed as array:\n", userArray.sort((a, b) => a.toLocaleUpperCase().localeCompare(b.toLocaleUpperCase())));
console.log("Acronym array:\n", acronyms.sort());
