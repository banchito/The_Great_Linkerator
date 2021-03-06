const client = require("./client");

const addTagToLink = async({linkId, tagId}) => {
    console.log(linkId, tagId);
    try {
        const {rows} = await client.query(`
            INSERT INTO link_tags ("linkId", "tagId")
            VALUES($1, $2)
            ON CONFLICT ("linkId","tagId") DO NOTHING
            RETURNING *;
        `,[linkId,tagId])
        return rows;
    } catch (error) {
        console.error(error)
        throw error
    }
}

const getLinkTagsBylink = async(id)=> {
    try {
        const { rows} = await client.query(`
            SELECT * FROM link_tags WHERE "linkId" = $1;
        `,[id])
        return rows;
    } catch (error) {
        console.error(error)
        throw error
    }
}

const getLinkTagsById = async(id)=>{
    try {
        const{rows:[link_tags]} = await client.query(`
            SELECT lt.id, lt."tagId", lt."linkId", l.url, l."dateShared", 
            l.comment, l."clickCount", t."tagName"
            FROM link_tags lt
            JOIN tags  t    ON lt."tagId"      = t.id
            JOIN links l    ON lt."linkId"     = l.id
            WHERE lt.id=$1`,[id]);
            return link_tags;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const destroyLinkTag = async(id) =>{
    try {
        const {rows} = await client.query(`
        DELETE FROM link_tags
        WHERE id = $1
        RETURNING *;
        `,[id])
        return rows;
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports = {addTagToLink, getLinkTagsById, getLinkTagsBylink, destroyLinkTag}