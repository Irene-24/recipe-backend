const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');


const app = express();

mongoose.connect('mongodb+srv://user:uEnoIe1QTptE7av6@api-alc-cluster-silou.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true })
  .then(() => 
  {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((err) => 
  {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(err);
  });


//PREVENT CORS ERRORS

app.use((req, res, next) => 
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(bodyParser.json());

app.post( '/api/recipes' , ( req , res , next ) => 
{
    
    const recipe = new Recipe(
      {
        title: req.body.title,
        ingredients:req.body.ingredients,
        instructions:req.body.instructions,
        time:req.body.time,
        difficulty: req.body.difficulty
      }
    );

    recipe.save()
      .then( () => 
        {
          res.status(201).json({message:"Yummy new recipe added to the list 😋."});
        })
      .catch( err =>
        {
          res.status(400).json({err});
        }) ; 
   
});

app.get('/api/recipes/:id', (req, res, next) => 
{
    Recipe.findOne({ _id: req.params.id})
    .then( recipe => 
      {
        res.status(200).json(recipe);
      })
    .catch( err => 
      {
        res.status(404).json({err});
      }
    );
});

app.put('/api/recipes/:id', (req, res, next) => 
{
    const recipe = new Recipe(
        {
          title: req.body.title,
          ingredients:req.body.ingredients,
          instructions:req.body.instructions,
          time:req.body.time,
          difficulty: req.body.difficulty
        }
      );

    Recipe.updateOne({_id: req.params.id}, recipe)
    .then( () => 
     {
        res.status(201).json({ message: 'Recipe updated successfully!' });
      })
    .catch( err => 
      {
        res.status(400).json({err});
      });
});

app.delete('/api/recipes/:id', (req, res, next) => 
{
    Recipe.deleteOne({_id: req.params.id})
    .then( () => 
      {
        res.status(200).json({ message: 'Recipe deleted successfully!' });
      })
      .catch( err => 
        {
          res.status(400).json({err});
       });
});

app.use( '/api/recipes' , ( req , res ) => 
{    
    Recipe.find()
     .then( recipes =>  res.status(200).json(recipes)  )  
     .catch( err => res.status(400).json(err) )     

});

app.use( '/' , ( req , res ) =>
{
    res.status(200).json({message:'Server is active'});
} );





module.exports = app;