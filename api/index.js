require('dotenv').config()
const express           = require('express'); // const apiRouter = require('express').Router();
const apiRouter         = express.Router();
const usersRouter       = require('./users');
const linksRouter       =require('./links')
 

apiRouter.get("/health", (req, res, next)=> {
    res.send({message:"All is good on /api/health!"});
    next();
});


apiRouter.use('/users', usersRouter);
apiRouter.use('/links', linksRouter)
apiRouter.use((error, req, res, next)=>{
    res.send( error);
})

module.exports = apiRouter;