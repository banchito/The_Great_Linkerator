const client = require('./client');
const {createLink, createTag, getLinksWithoutTags, getAllTags, addTagToLink, getAllLinksByUser, getLinksBytag, destroyLink } = require("../db");

async function dropTables() {
  try {
    console.log("Dropping All Tables...");
    client.query(`
      DROP TABLE IF EXISTS link_tags;
      DROP TABLE IF EXISTS links;
      DROP TABLE IF EXISTS tags;
    `);
    console.log("Finishing Dropping All Tables...");
  } catch (error) {
    console.error("Error while dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");
    await client.query(`

    CREATE TABLE tags(
      id SERIAL PRIMARY KEY,
      "tagName" VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE links(
      id SERIAL PRIMARY KEY,
      url TEXT UNIQUE NOT NULL,
      "dateShared" DATE NOT NULL DEFAULT CURRENT_DATE,
      comment TEXT,
      "clickCount" INTEGER NOT NULL
    );
    
    CREATE TABLE  link_tags(
      id SERIAL PRIMARY KEY,
      "linkId" INTEGER REFERENCES links(id) ON DELETE CASCADE NOT NULL, 
      "tagId" INTEGER REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
      UNIQUE("linkId", "tagId")
    );

    `);
    console.log('Finished constructing tables!');
  } catch (error) {
    console.error('Error constructing tables!');
    throw error;
  }
}



async function createInitialTags() {
  try {
    console.log("Starting to create tags...");
    const tagsToCreate = [
     "social",
     "sport",
     "search",
     "knowledge",
     "tool",
     "personal",
     "hobbie",
    ];
    const tags = await Promise.all(tagsToCreate.map(createTag));
    console.log("tags created:", tags);
    console.log("Finished creating tags!");
  } catch (error) {
    console.error("Error creating tags!");
    throw error;
  }
}

async function createInitialLinks() {
  console.log("starting to create links...");

  try {
    const linksToCreate = [
      {
        url: 'https://www.fullstackacademy.com/',
        comment: "To learn",
        clickCount: 0,
      },
      {
        url: "https://github.com/banchito",
        comment: "My Github",
        clickCount: 0,
      },
      {
        url: "https://www.google.com/",
        comment: "Best search engine",
        clickCount: 0,
      },
      {
        url: "https://twitter.com/",
        comment: "To stay informed",
        clickCount: 0,
      }, 
    ];
    const links =  await Promise.all(linksToCreate.map((link)=> createLink(link)));
    console.log("links Created: ", links);
    console.log("Finished creating links.");
  } catch (error) {
    console.error("Error creating links!");
    throw error;
  }
}

async function createInitialLinkTags(){
  try {
    console.log("starting to create link_tags...")
    const [Fullstack, github, google, twitter] = await getLinksWithoutTags();

    const [tag1, tag2, tag3, tag4, tag5, tag6, tag7 ] = await getAllTags();

    const linkTagsToCreate = [
      {
        linkId: Fullstack.id,
        tagId: tag4.id
      },
      {
        linkId: github.id,
        tagId: tag1.id
      },
      {
        linkId: github.id,
        tagId: tag6.id
      },
      {
        linkId: twitter.id,
        tagId: tag1.id
      },
      {
        linkId: twitter.id,
        tagId: tag5.id
      },
    ];
    const linkTags = await Promise.all(linkTagsToCreate.map(addTagToLink))
    console.log("link_tags created: ", linkTags);
    console.log("Finished creating link_tags!");

  } catch (error) {
    console.error("Error creating link_tags!!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialTags();
    await createInitialLinks();
    await createInitialLinkTags();
    
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

module.exports = {
  rebuildDB,
};
