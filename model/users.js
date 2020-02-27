module.exports = {
    getUserById: async function(id){
        console.log(`getUserById called with id: ${id}`);

        // Add implementation here

        return {};
    },

    getUsersByAge: async function(age) {
        console.log(`getUsersByAge called with age: ${age}`);
        
        // Add implementation here
        
        return [];
    },

    getUsersByCountry: async function(country) {
        console.log(`getUsersByCountry called with country: ${country}`);
        
        // Add implementation here
        
        return [];
    },

    getUsersByName: async function(name) {
        console.log(`searchUsersByName called with name: ${name}`);
        
        // Add implementation here
        
        return [];
    },

    deleteUser: async function(id) {
        console.log(`deleteUser called with id: ${id}`);
        // Add implementation here
        
        return;
    }
}