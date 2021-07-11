require('dotenv').config()
const express           = require('express'); // const apiRouter = require('express').Router();
const apiRouter         = express.Router();
const linksRouter       =require('./links');
const tagsRouter        =require('./tags')
const linkTagsRouter    =require('./link_tags')
 

apiRouter.get("/health", (req, res, next)=> {
    res.send({message:"All is good on /api/health!"});
    next();
});


apiRouter.use('/links', linksRouter);
apiRouter.use('/tags', tagsRouter);
apiRouter.use('/linkTags',linkTagsRouter)
apiRouter.use((error, req, res, next)=>{
    res.send( error);
})

module.exports = apiRouter;