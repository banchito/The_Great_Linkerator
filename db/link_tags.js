const client = require("./client");

const addTagToLink = async({linkId, tagId}) => {
    try {
        const {rows: [link_tag]} = await client.query(`
            INSERT INTO link_tags ("linkId", "tagId")
            VALUES($1, $2)
            RETURNING *;
        `,[linkId,tagId])
        return link_tag;
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports = {
    addTagToLink
}