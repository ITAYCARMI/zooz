
function calculateAge(dob){
    const dateNow = Date.now();
    const splitedDob = dob.split('/');
    const formatDob = new Date(splitedDob[2],splitedDob[1],splitedDob[0]);
    const diff_ms = dateNow - formatDob.getTime();
    const age = new Date(diff_ms);
    return Math.abs(age.getUTCFullYear() - 1970);
}

function getNamePermutations(name){
    let allNamePermutations = [];
    for(let index=3; index <= name.length; index++)
        allNamePermutations.push(name.substring(0,index));
    return allNamePermutations;
}

module.exports = {calculateAge, getNamePermutations};