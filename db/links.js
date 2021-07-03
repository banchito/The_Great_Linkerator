const client = require('./client')

const createLink = async ({url, creatorId, comment, clickCount}) => {
    console.log()
    try {
        const {rows: [link]} = await client.query(`
        INSERT INTO links (url, "creatorId", comment, "clickCount")
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (url) DO NOTHING
        RETURNING *;
        `, [url, creatorId, comment, clickCount]);
        return link
    } catch (error) {
        console.log(error)
        throw error

    }
} 


const getLinksWithoutTags = async() => {
    try {
        const {rows} = await  client.query(`
            SELECT id, url, "creatorId", "dateShared", comment, "clickCount" FROM links;
        `)
        return rows
    } catch (error) {
        console.error(error)
        throw error
    }
}

 module.exports = { createLink, getLinksWithoutTags }