const linkTagsRouter  = require('express').Router();
const { destroyLinkTag} = require("../db");

linkTagsRouter.use((req, res, next) => {
    console.log("A request is being made to /link_tags");
    next();
  });

linkTagsRouter.delete("/:linkTagId", async (req, res, next) => {
    const { linkTagId } = req.params;
    try {
      
        const linkTagToDelete = await getLinkTagsById(linkTagId);

        linkTagToDelete
        ? res.send(await destroyLinkTag(linkTagToDelete.id))
        : res.status(403).send({ message: `Link Tag not found` });
      
    } catch (error) {
        next(error);
    }
  }
);

module.exports = linkTagsRouter