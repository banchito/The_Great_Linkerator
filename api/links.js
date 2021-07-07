const linksRouter       = require('express').Router();
const { verifyToken }   = require('../utils');   
const {getAllLinks, createLink, updateLink, getLinkById, destroyLink, getAllLinksAndTheirTags, addTagToLink} = require("../db");

linksRouter.use((req, res, next)=>{
    console.log("A request is being made to /links");
    next();
})

linksRouter.get("/", async(req ,res ,next) => {
    try{
        const links = await getAllLinksAndTheirTags();
        res.send(links)
    }catch(error){
        next(error)
    }
});

linksRouter.post("/", async(req, res, next) => {
    const {url, comment} = req.body;
    const headersAuth  = req.headers.authorization;
    console.log("api",headersAuth);
    try{

    if(!headersAuth) return res.status(403).send({ message: `Please login` });

    const verifiedToken = verifyToken(headersAuth);
     verifiedToken 
     ? res.send(await createLink({ url ,creatorId: verifiedToken.id, comment, clickCount:0 }))
     : res.status(403).send({ message: `Please login` });
            
    }catch(error){
        next(error)
    }
})

linksRouter.patch("/:linkId", async(req, res, next) => {
    const { linkId }        = req.params;
    const {url, comment}    = req.body;
    const headersAuth = req.headers.authorization;
    
    try{
        if (!headersAuth) return res.status(403).send({ message: `Please login` });

        const verifiedToken  = verifyToken(headersAuth);
        const linkToUpdate   = await getLinkById(linkId)
        
        if(!linkToUpdate) res.status(403).send({ message: `Link does not exist` });

        verifiedToken.id === linkToUpdate.creatorId
        ? res.send(await updateLink({id: linkId, url, comment}))
        : res.status(403).send({ message: `Link creator not logged in` });
            
    }catch(error){
        next(error)
    }
})

linksRouter.delete("/:linkId", async(req, res, next) => {
    const {linkId}  = req.params;
    const headersAuth    = req.headers.authorization;
    console.log(linkId);
    try{
        if (!headersAuth) return res.status(403).send({ message: `Please login` });
       
        const verifiedToken      = verifyToken(headersAuth);
        const linkToDelete       = await getLinkById(linkId);

        verifiedToken.id === linkToDelete.creatorId
        ? res.send(await destroyLink(linkToDelete.id))
        : res.status(403).send({ message: `Link creator not logged in` });
            
        
    }catch(error){
        next(error)
    }
})

linksRouter.post("/:linkId/tags", async(req, res, next) => {
    const {linkId} = req.params;
    const {tagId}  = req.body;
    try {
        const link_tag = await addTagToLink({linkId, tagId})
        console.log(link_tag);
        res.send(link_tag);
    } catch (error) {
        next(error)
    }
})



module.exports = linksRouter;