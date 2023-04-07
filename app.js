const express = require('express')
const {success, getUniqueId} = require('./helper')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const {Sequelize} = require('sequelize')
let pokemons = require('./mock-pokemon')

const app = express()
const port = 3000

const sequelize = new Sequelize(
    'pokedex',
    'root',
    '',
    {

        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2'
        },
        logging: false
    }
)

sequelize.authenticate()
.then(_ => console.log('La connexion avec la base de donnée a bien été établie.'))
.catch(error => console.log(`Ompossible de se connecter à la base de donnée : ${error}`))

app
    .use(favicon(`${__dirname}/favicon.ico`))
    .use(morgan('dev'))
    .use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello, Express again !'))

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    const message = 'Un pokémon a bien été trouvé.'
    res.json(success(message,pokemon))
})

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons)
    const pokemonCreated = {...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokémon ${pokemonCreated.name} a bien été crée.`
    res.json(success(message, pokemonCreated))
})

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonUpdated = {...req.body, id: id}
    const oldPokemon = pokemons.find(pokemon => pokemon.id === id)

    if(oldPokemon){
        pokemonUpdated.id = oldPokemon.id
        pokemonUpdated.created = oldPokemon.created
    }

    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })
    const message = `le pokémon ${pokemonUpdated.name} a bien été modifié.`
    res.json(success(message, pokemonUpdated))
})

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
    pokemons = pokemons.filter(pokemon => pokemon.id !== id)
    const message = `le pokémon ${pokemonDeleted.name} a bien été supprimé.`
    res.json(success(message, pokemonDeleted))
})

app.get('/api/pokemons', (req, res) =>{
    const num = pokemons.length
    const message = `Une liste de ${num} pokémon${pokemons.length > 1 ? 's' : ''} a été récupérée.`
    res.json(success(message, pokemons))
})

app.listen(port, () => console.log(`Notre application est démarrée sur : http://localhost:${port}`))