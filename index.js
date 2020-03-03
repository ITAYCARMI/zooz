const express = require('express');
const bodyParser = require('body-parser');
const usersModel = require('./model/users');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const {createDictionaries} = require('./services/csvService');
const SUPPORTED_QUERY = ['country', 'name', 'email', 'age'];
const BAD_QUERY_MSG = `Only one query param is supported, and it must be one of the following: ${SUPPORTED_QUERY.join(', ')}`;
const PORT = process.env.PORT || 8000;
const app = express();
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
createDictionaries('./data.csv');

app.get('/users/:id', async (req, res, next) => {
    let id = req.params.id;
    try {
        let user = await usersModel.getUserById(id);
        if (!user.Id){
            return res.status(404).json({message:`id ${id} not found`});
        }
        return res.json(user);
    } catch (err){
        console.error(err, 'Error during get user');
        return res.status(500).json({
            message: 'Error during get user'
        })
    }
});

app.get('/users', async (req, res, next) => {
    let query = req.query;
    let result;
    try {
        // Make sure only valid query params were passed:
        let queryKeys = Object.keys(query);
        if (queryKeys.length > 1 || queryKeys.length === 0 || !SUPPORTED_QUERY.includes(queryKeys[0].toLowerCase())){
            return res.status(400).json({
                message: BAD_QUERY_MSG
            })
        }

        let queryParam = queryKeys[0].toLowerCase();

        switch (queryParam){
        case 'country':
            result = await usersModel.getUsersByCountry(query.country);
            if (!result.length)
                return res.status(404).json({message:`Country ${query.country} not found`});
            break;
        case 'name':
            result = await usersModel.getUsersByName(query.name.toLowerCase());
            if (!result.length)
                return res.status(404).json({message:`Name ${query.name} not found`});
            break;
        case 'age':
            result = await usersModel.getUsersByAge(query.age);
            if (!result.length)
                return res.status(404).json({message:`Age ${query.age} not found`});
            break;
        default:
            return res.status(400).json({
                message: BAD_QUERY_MSG
            })
        }
    } catch (err){
        console.error(err, 'Error during get users');
        return res.status(500).json({
            message: 'Error during get users'
        });
    }

    res.json(result);
});

app.delete('/users/:id', async (req, res, next) => {
    let id = req.params.id;
    try {
        await usersModel.deleteUser(id);
    } catch (err){
        console.error(err, 'Error during delete user');
        return res.status(500).json({
            message: 'Error during delete user'
        });
    }

    // Success
    return res.status(204).send(`User ${id} deleted`);
});

app.use((req, res) => {
    res.status(404).json({ message: 'Path not found, only the following paths are supported: GET /users/:id, GET /users' });
  });

server = app.listen(PORT, function() {
    console.log(`Test Server listening.. Access it using address: http://localhost:${PORT}`);
    console.log(`Swagger using address: http://localhost:${PORT}/api-docs`);
});