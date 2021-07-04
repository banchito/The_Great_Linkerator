const client = require('./client');
const {createLink, createTag, createUser, getLinksWithoutTags, getAllTags, addTagToLink, getAllUsers, getLinksBytag, destroyLink, getLinkTagsById } = require("../db");

async function dropTables() {
  try {
    console.log("Dropping All Tables...");
    client.query(`
      DROP TABLE IF EXISTS link_tags;
      DROP TABLE IF EXISTS links;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS users;
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

    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );

    CREATE TABLE tags(
      id SERIAL PRIMARY KEY,
      "tagName" VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE links(
      id SERIAL PRIMARY KEY,
      url TEXT UNIQUE NOT NULL,
      "creatorId" INTEGER,
      "dateShared" DATE NOT NULL DEFAULT CURRENT_DATE,
      comment TEXT,
      "clickCount" INTEGER NOT NULL,
      FOREIGN KEY ("creatorId") REFERENCES users(id)
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

async function createInitialUsers() {
  console.log("Starting to create users...");
  try {

    await createUser({ username: 'albert', password: 'bertie99' });
    await createUser({ username: 'sandra', password: '2sandy4me' });
    await createUser({ username: 'glamgal', password: 'soglam' });
    
    const users = await getAllUsers()
      console.log("Finished creating users!", users);
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}


async function createInitialTags() {
  try {
    console.log("Starting to create tags...");
    const tagsToCreate = [
      {tagName: "social"},
      {tagName: "sport"},
      {tagName: "search"},
      {tagName: "knowledge"},
      {tagName: "tool"},
      {tagName: "personal"},
      {tagName: "hobbie"},
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
        creatorId: 2,
        comment: "To learn",
        clickCount: 0,
      },
      {
        url: "https://github.com/banchito",
        creatorId: 1,
        comment: "My Github",
        clickCount: 0,
      },
      {
        url: "https://www.google.com/",
        creatorId: 2,
        comment: "Best search engine",
        clickCount: 0,
      },
      {
        url: "https://twitter.com/",
        creatorId: 1,
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

    const lT = await getLinksBytag(tag1)
    console.log("linkTags(1)",lT );

    const erasedLink = await destroyLink(twitter.id)
    console.log("link destroyed", erasedLink);

    const test = await client.query(`
      select * from links;
    `);
    console.log("test",test);
    const test2 = await client.query(`
      select * from link_tags;
    `)
    console.log("test",test2);

    const l_t = await getLinkTagsById(google.id)
    console.log("link_tags by ID:", l_t)

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
    await createInitialUsers();
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
