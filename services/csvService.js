const csv = require('csv-parser');
const fs = require('fs');
const {calculateAge, getNamePermutations} = require('../utils/utils');
let csvData = [];
let idDictionary = {};
let fullNameDictionary  = {};
let namePermutationsDictionary = {};
let ageDictionary = {};
let countryDictionary = {};

function createDictionaries(file){
    fs.createReadStream(file)
        .pipe(csv())
        .on('data', (data) => {csvData.push(data);
            idDictionary[data['Id']] = data;
            createFullNameDictionary(data);
            createNamePermutationsDictionary(data);
            createCountryDictionary(data);
            createAgeDictionary(data);
        })
        .on('end', () => {
            console.log('initialize dictionaries');
        });
}

function createFullNameDictionary(data){
    if (!fullNameDictionary[data['Name'].toLowerCase()]) fullNameDictionary[data['Name'].toLowerCase()] = [];
    fullNameDictionary[data['Name'].toLowerCase()].push(data['Id']);
}

function createNamePermutationsDictionary(data){
    const splitedName = data['Name'].split(' ');
    let firstNamePermutations = getNamePermutations(splitedName[0].toLowerCase());
    let lastNamePermutations = getNamePermutations(splitedName[1].toLowerCase());
    let allNamePermutations = firstNamePermutations.concat(lastNamePermutations);
    allNamePermutations = [...new Set(allNamePermutations)];
    for (let name in allNamePermutations){
        if (!namePermutationsDictionary[allNamePermutations[name]]) {
            namePermutationsDictionary[allNamePermutations[name]] = [];
        }
        namePermutationsDictionary[allNamePermutations[name]].push(data['Id']);
    }
}

function createCountryDictionary(data){
    if (!countryDictionary[data['Country']]) countryDictionary[data['Country']] = [];
    countryDictionary[data['Country']].push(data['Id']);
}

function createAgeDictionary(data){
    const age = calculateAge(data['DOB']);
    if (!ageDictionary[age]) ageDictionary[age] = [];
    ageDictionary[age].push(data['Id']);
}

module.exports={
    createDictionaries,
    idDictionary,
    fullNameDictionary,
    countryDictionary,
    ageDictionary,
    namePermutationsDictionary
};