const connection = require("../config/database");

/**
 * Get a list of configuration settings stored in the database
 * @returns
 */
async function updateProfileImageUrlByTicketId(ticketId, imageUrl) {
    console.log("Entered updateProfileImageUrl");
    let result = null;
    try {
        let sql = ` UPDATE visitor
                    SET
                    profileImageUrl = ?
                    WHERE ticket_id = ?
                `;
        await connection.execute(sql, [imageUrl, ticketId]);
        result = true;
    } catch (ex) {
        console.error(`An Exception have occurred while trying to dal.visitordal.updateProfileImageUrl(ticketId: ${ticketId}, imageUrl: ${imageUrl}) - ${ex}`);
        throw ex;
    }
    return result;
}
module.exports.updateProfileImageUrlByTicketId = updateProfileImageUrlByTicketId;