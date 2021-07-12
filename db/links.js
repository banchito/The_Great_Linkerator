const client = require('./client')

const createLink = async ({url, comment, clickCount}) => {
    console.log("route", url, comment, clickCount);
    console.log()
    try {
        const {rows: [link]} = await client.query(`
        INSERT INTO links (url, comment, "clickCount")
        VALUES ($1, $2, $3)
        ON CONFLICT (url) DO NOTHING
        RETURNING *;
        `, [url, comment, clickCount]);
        return link;
    } catch (error) {
        console.log(error)
        throw error

    }
} 

const getAllLinks = async() => {
    try{
        const {rows} = await client.query(`
            SELECT * FROM links;
        `)
        return rows
    }catch(error){
        console.error(error)
        throw error
    }
}

const getLinkById = async(id) => {
    try {
        const { rows: [link]} = await client.query(`
            SELECT * FROM links WHERE id=$1;
        `,[id]);
        return link;
    } catch (error) {
        console.error(error)
        throw error             
    }
}

const getLinksWithoutTags = async() => {
    try {
        const {rows} = await  client.query(`
            SELECT id, url, "dateShared", comment, "clickCount" FROM links;
        `)
        return rows
    } catch (error) {
        console.error(error)
        throw error
    }
}

const updateLink = async(fields = {}) =>{
    console.log("db",fields)
    const idReference = fields.id
    delete fields.id

    const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(", ")

    if(setString.length === 0) return;

    try {
        let linkToUpdate = await getLinkById(idReference);

        if(!linkToUpdate) return;

        const {rows:[link]} = await client.query(`
            UPDATE links
            SET ${setString}
            WHERE id = ${linkToUpdate.id}
            RETURNING *;
        `, Object.values(fields));
        return link;
    } catch (error) {
        console.error(error)
        throw error
    }
}

const destroyLink = async(id) => {
    try {
         await client.query(`
            DELETE FROM links
            WHERE id = $1;
        `,[id]);
    } catch (error) {
        console.error(error)
        throw error     
    }
}

const getLinksBytag = async(tag) => {
    const {id} = tag
    try {
        const {rows} = await client.query(`
            SELECT l.id, l.url, l."dateShared", l."clickCount", t.id as "tagId", t."tagName"
            FROM link_tags lt
            JOIN tags t ON lt."tagId"       = t.id
            JOIN links l ON lt."linkId"     = l.id
            WHERE t.id = $1;
        `,[id]);
        rows.forEach((row)=>{
            row.tags = [{id: row.tagId, tagName: row.tagName}]
            delete row.tagId;
            delete row.tagName
        });
        
        return rows;
    } catch (error) {
        console.error(error)
        throw error
    }
}

const getTagsforLink = async(linkId) =>{
    try {
        const {rows} = await client.query(`
        SELECT t.id, t."tagName"
        FROM link_tags lt
        JOIN tags t ON lt."tagId"       = t.id
        JOIN links l ON lt."linkId"     = l.id
        WHERE l.id = $1;`,[linkId]);

        return rows;
    } catch (error) {
        throw error
    }
}



const getAllLinksAndTheirTags = async()=> {

    try {
        const links = await getAllLinks();
       
        const linksWithTags = Promise.all(links.map(async(link)=>{
            const tags = await getTagsforLink(link.id)
            return {
                ...link,
                tags,
            }
        }))

        // for(let i = 0; i<links.length; i++){
            // const tags = await getTagsforLink(links[i].id)
            // linksWithTags.push({
                // ...links[i],
                // tags,
            // })
        // }
        return linksWithTags
    } catch (error) {
        console.error(error)
        throw error
    }
}


 module.exports = { createLink, getLinksWithoutTags, getLinkById, getLinksBytag, updateLink, destroyLink, getAllLinks, getAllLinksAndTheirTags }