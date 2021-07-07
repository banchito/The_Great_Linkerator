const tagsRouter  = require('express').Router();
const { verifyToken }   = require('../utils');   
const{getAllTags, getTagsBYlink} = require('../db');


tagsRouter.use((req, res, next)=>{
    console.log("A request is being made to /tags");
    next();
})

tagsRouter.get("/", async(req, res, next)=>{
    try {
        const tags = await getAllTags();
        res.send(tags)
    } catch (error) {
        next(error);
    }
})

tagsRouter.post("/", async(req, res, next)=>{
    const {tagName} = req.body;
    const headersAuth = req.headers.authorization;

    try{
        if (!headersAuth) return res.status(403).send({ message: `Please login` });
        const verifiedToken = verifyToken(headersAuth);
       
        verifiedToken 
        ? res.send(await createTag(tagName))
        : res.status(403).send({ message: `Please login` });

    }catch(error){
        next(error);
    }
})

tagsRouter.get("/:linkId/tags",  async(req, res, next)=>{
    const {linkId} = req.params;
    try{
        const tagsByLink = await getTagsBYlink(linkId);
        res.send(tagsByLink);
    }catch(error){
        next(error)
    }

})

module.exports = tagsRouter;