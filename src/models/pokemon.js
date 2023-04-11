const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée']

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Ce nom est déjà pris.'
        },
        validate: {
          notEmpty: {msg: 'Le nom ne peut pas être vide.'},
          notNull: {msg: 'Le nom ne peut pas être null.'}
        }
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {msg: 'Utilisez uniquement des nombres entiers pour les points de vie'},
          notNull: {msg: 'Les points de vie sont une propriété requise.'},
          min: {
            args: [0],
            msg: 'Les poinst de vie doivent être supérieurs ou égal à zéro !'
          },
          max:{
            args: [999],
            msg: 'Les poinst de vie ne peuvent pas dépasser 999 !'
          }
        }        
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {msg: 'Utilisez uniquement des nombres entiers pour les points de vie'},
          notNull: {msg: 'Les points de vie sont une propriété requise.'},
          min: {
            args: [0],
            msg: 'Les poinst de vie doivent être supérieurs ou égal à zéro !'
          },
          max:{
            args: [999],
            msg: 'Les poinst de vie ne peuvent pas dépasser 999 !'
          }
        }        
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: {msg: 'Utilisez uniquement des urls valides.'},
          notNull: {msg: 'Le lien de l\'image est une propriété requise.'}
        }        
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get(){
          return this.getDataValue('types').split(',') // C'est vraiment pas beau !
        },
        set(types){
          this.setDataValue('types', types.join()) // idem
        },
        validate: {
          isTypesValid(value){
            if(!value){
              throw new Error('Un pokémon doit avoir au moins un type.')
            }

            const values = value.split(',')

            if(values.length > 3){
              throw new Error('Un pokémon ne peux pas avoir plus de trois types.')
            }

            values.forEach(type => {
              if(!validTypes.includes(type)){
                throw new Error(`Le type d'un pokémon doit appartenir à la liste suivante : ${validTypes}`) // Il faut un distinct...
              }
            });
          }
        }
      }
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
    })
  }