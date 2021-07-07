const linkTagsRouter  = require('express').Router();
const { verifyToken }   = require('../utils');   
const { destroyLinkTag} = require("../db");

linkTagsRouter.use((req, res, next) => {
    console.log("A request is being made to /link_tags");
    next();
  });

linkTagsRouter.delete("/:linkTagId", async (req, res, next) => {
    const { linkTagId } = req.params;
    const headersAuth = req.headers.authorization;
    try {
      if (headersAuth) {
        const verifiedToken = verifyToken(headersAuth);
        const linkTagToDelete = await getLinkTagsById(linkTagId);

        (verifiedToken.id === linkTagToDelete.creatorId)
        ? res.send(await destroyLinkTag(linkTagToDelete.id))
        : res.status(403).send({ message: `Link creator not logged in` });
      }
    } catch (error) {
        next(error);
    }
  }
);

module.exports = linkTagsRouter