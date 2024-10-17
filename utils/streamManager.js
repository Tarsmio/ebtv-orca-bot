const { getToornamentStreamUrl } = require("./toornamentUtils")

let streamUrl = null;
const STREAM_IDS = require("./../data/streamer_ids.json")

// Getter
function getStreamUrl() {
    return streamUrl;
}

/**
 * Sets the stream URL for a member using the provided member ID.
 * @param {string} memberId - The ID of the member for whom to set the stream URL.
 * @returns {Promise<void>} Returns a promise that resolves once the stream URL is set for the member, or resolves without setting the stream URL if the member ID is not found.
 */
async function setStreamUrl(memberId) {
    if (STREAM_IDS[memberId] !== undefined) {
        streamUrl = await getToornamentStreamUrl(STREAM_IDS[memberId]);
    }
}

// Exporting getter/setter functions
module.exports = {
    getStreamUrl,
    setStreamUrl
};