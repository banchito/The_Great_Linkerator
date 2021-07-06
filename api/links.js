const linksRouter       = require('express').Router();
const { verifyToken }   = require('../utils');   
const {getAllLinks, createLink, updateLink, getLinkById} = require("../db");

linksRouter.use((req, res, next)=>{
    console.log("A request is being made to /links");
    next();
})

linksRouter.get("/", async(req ,res ,next) => {
    try{
        const links = await getAllLinks();
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
        const linkToUpdate   = await getLinkById(routineId)
        
        if(!linkToUpdate) res.status(403).send({ message: `Link does not exist` });

        verifiedToken.id === linkToUpdate.creatorId
        ? res.send(await updateLink({id: linkId, url, comment}))
        : res.status(403).send({ message: `Link creator not logged in` });
            
    }catch(error){
        next(error)
    }
})


module.exports = linksRouter;