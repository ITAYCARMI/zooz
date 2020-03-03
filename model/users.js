const csvService = require('../services/csvService');
let deletedUsersId = {};

function getUsersDataByIds(ids){
    let result = [];
    for (let id in ids){
        if (deletedUsersId[ids[id]]) continue;
        result.push(csvService.idDictionary[ids[id]]);
    }
    return result;
}

module.exports = {

    //Get user by Id
    //     - GET /users/a2ee2667-c2dd-52a7-b9d8-1f31c3ca4eae
    //     - Should return the requested user details
    //
    // Example required response:
    // {
    //     "id": "ae8da2bf-69f6-5f40-a5e6-2f1fedb5cea6",
    //     "name": "Ricardo Wise",
    //     "dob": "13/1/1973",
    //     "country": "AE"
    // }

    getUserById: async function(id){
        console.log(`getUserById called with id: ${id}`);

        try {
            if (deletedUsersId[id]) return {};
            const result = await csvService.idDictionary[id];
            return result || {};
        }
        catch (e) {
            throw e;
        }
    },

    //Get users list by age
    //     - GET /users?age=30
    //     - Should return all users which are of age 30 at the time of the request

    getUsersByAge: async function(age) {
        console.log(`getUsersByAge called with age: ${age}`);
        
        const ids = await csvService.ageDictionary[age];
        let result = [];
        if (ids){
            result = getUsersDataByIds(ids);
        }
        return result;
    },

    //Get users list by country
    //     - GET /users?country=US
    //     - Should return a list of all users from requested country

    getUsersByCountry: async function(country) {
        console.log(`getUsersByCountry called with country: ${country}`);
        
        const ids = await csvService.countryDictionary[country];
        let result = [];
        if (ids){
            result = getUsersDataByIds(ids);
        }
        return result;
    },

    //Get users list by name
    //     - GET /users?name=Susan
    //     - Should return all users which name matches the requested name
    //     - Matching names rules:
    //         - Full match - for input "Susan James" should return all users with name "Susan James".
    //         - Full first name or last name - for input "Susan" should return all users with that first or last name.
    //         - Partial match (minimum 3 chars) - for input "Sus", should return all users with first or last name that begin with "Sus".
    //         - Should support non case sensitive search (Searching for "susan" should return users with name "Susan").
    //
    // Example required response for list of users:
    // [
    //     {
    //         "id": "ae8da2bf-69f6-5f40-a5e6-2f1fedb5cea6",
    //         "name": "Ricardo Wise",
    //         "dob": "13/1/1973",
    //         "country": "AE"
    //     }
    // ]

    getUsersByName: async function(name) {
        console.log(`searchUsersByName called with name: ${name}`);
        
        const requestedIds = {};
        let result = [];
        let ids;
        if (name.length < 3) return result;
        if (name.indexOf(' ') !== -1) ids = await csvService.fullNameDictionary[name];
        else ids = await csvService.namePermutationsDictionary[name];
        if (ids){
            for (let id in ids){
                requestedIds[ids[id]] = true;
            }
        }
        if (requestedIds.size !== 0){
            result = getUsersDataByIds(Object.keys(requestedIds));
        }
        return result;
    },

    //Delete user by id
    //     - DELETE /users/a2ee2667-c2dd-52a7-b9d8-1f31c3ca4eae
    //     - Should delete the user, after the call the user will not be returned by any of the previous APIs.

    deleteUser: async function(id) {
        console.log(`deleteUser called with id: ${id}`);
        try {
            if (csvService.idDictionary[id] && !deletedUsersId[id]){
                deletedUsersId[id] = true;
                return;
            }
        }
        catch (e) {
            throw e;
        }
    }
};