const client = require("./client")

const createTag = async(tagName) => {
    try {
        const {rows} = await client.query(`
            INSERT INTO tags ("tagName")
            VALUES($1)
            ON CONFLICT ("tagName") DO NOTHING
            RETURNING *;
        `, [tagName])
        return rows
    } catch (error) {
        console.log(error)
        throw error
    }
}

const getAllTags = async() => {
    try {
        const {rows} = await client.query(`
            SELECT id, "tagName" FROM tags;
        `);
        return rows;
    } catch (error) {
        console.log(error)
        throw error
    }
}

const getTagById = async(id) => {
    try {
        const {rows: [tag]} = await client.query(`
        SELECT * FROM tags WHERE id=$1;
        `, [id]);
        return tag;
    } catch (error) {
        console.error(error)
        throw error
    }
}

const getTagsBYlink = async(linkId)=> {
    try {
        const {rows} = await client.query( `
        SELECT l.id, l.url, t.id as "tagId", t."tagName"
        FROM link_tags lt
        JOIN tags t ON lt."tagId"       = t.id
        JOIN links l ON lt."linkId"     = l.id
        WHERE l.id = $1;
        `,[linkId])
        console.log(rows)
        return rows;
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports = { createTag, getAllTags, getTagById, getTagsBYlink}