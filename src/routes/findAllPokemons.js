const { Pokemon } = require('../db/sequelize')
const {Op} = require('sequelize')
const auth = require('../auth/auth')
  
module.exports = (app) => {
  app.get('/api/pokemons', auth, (req, res) => {
    if(req.query.name){
        const name = req.query.name
        if(name.length < 2){
           return res.status(400).json('Il faut au moins 2 caractères pour la recherche par nom.')
        }
        const limit = parseInt(req.query.limit) || 5
        return Pokemon.findAndCountAll({ 
            where: {
                name: { // est la propriété
                    [Op.like]: `%${name}%` // name est le critère de recherche
                }
            },
            order: ['name'],
            limit: limit,           
        })
        .then(({count, rows}) => {
            const message = `Il y a ${count} pokémon${count > 1 ? 's' : ''} qui correspond${count > 1 ? 'ent' : ''} au terme de recherche ${name}.`
            res.json({message, data: rows})
        })
    } else {
        Pokemon.findAll({order: ['name']})
      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.'
        res.json({ message, data: pokemons })
      })
      .catch(error => {
        const message = `La liste des pokémons n'a pas pu être récupéree. Réessayez dans quelques instants.`
        res.status(500).json({message, data: error}) 
      })
    }    
  })
}