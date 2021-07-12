const linksRouter       = require('express').Router();
const {getAllLinks, createLink, updateLink, getLinkById, destroyLink, getAllLinksAndTheirTags, addTagToLink, createTag} = require("../db");

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

     const {url:{url,comment}} = req.body;
    
    console.log("route", req.body);
    console.log("route", url, comment);
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
    const {url, comment, clickCount}    = req.body;
    
    try{

        const linkToUpdate  = await getLinkById(linkId);
        

        linkToUpdate
        ? res.send(await updateLink({id: linkId, url, comment, clickCount}))
        : res.status(403).send({ message: `Link does not exist.` });
            
    }catch(error){
        next(error)
    }
})

linksRouter.delete("/:linkId", async(req, res, next) => {
    const {linkId}  = req.params;
    
    try{
        const linkToDelete = await getLinkById(linkId);
        const linkToDeleteAsInt = parseInt(linkToDelete.id);
        linkToDelete
        ? res.send(await destroyLink(linkToDeleteAsInt))
        : res.status(403).send({ message: `Link does not exist.` });
            
        
    }catch(error){
        next(error)
    }
})

linksRouter.post("/:linkId/tags", async(req, res, next) => {
    const {linkId} = req.params;
    const {tagId}  = req.body;
    try {
       
        const link_tag  = await addTagToLink({linkId, tagId})
        res.send(link_tag);
    } catch (error) {
        next(error)
    }
})



module.exports = linksRouter;