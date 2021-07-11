const linksRouter       = require('express').Router();
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
    try{

    

     (url && comment)
     ? res.send(await createLink({ url, comment, clickCount:0 }))
     : res.status(403).send({ message: `Please Provide URL and Comment` });
            
    }catch(error){
        next(error)
    }
})

linksRouter.patch("/:linkId", async(req, res, next) => {
    const { linkId }        = req.params;
    const {url, comment}    = req.body;
    
    try{

        const linkToUpdate  = await getLinkById(linkId);
        

        linkToUpdate
        ? res.send(await updateLink({id: linkId, url, comment}))
        : res.status(403).send({ message: `Link does not exist.` });
            
    }catch(error){
        next(error)
    }
})

linksRouter.delete("/:linkId", async(req, res, next) => {
    const {linkId}  = req.params;
    try{
       
        const linkToDelete = await getLinkById(linkId);

        linkToDelete
        ? res.send(await destroyLink(linkToDelete.id))
        : res.status(403).send({ message: `Link does not exist.` });
            
        
    }catch(error){
        next(error)
    }
})

linksRouter.post("/:linkId/tags", async(req, res, next) => {
    const {linkId} = req.params;
    const {tagId}  = req.body;
    try {
        const link_tag = await addTagToLink({linkId, tagId})
        res.send(link_tag);
    } catch (error) {
        next(error)
    }
})



module.exports = linksRouter;