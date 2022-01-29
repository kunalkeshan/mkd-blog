const rebrandly = require("rebrandly");
const {
  rebrandly: { rebrandlyApiKey },
} = require("../../../helper/config");

const rebrandlyApp = new rebrandly({
  apiKey: rebrandlyApiKey,
});
// console.log(client.links.create({
//     destination: "https://kunalkeshan.dev",
//     domain: {fullName: "rebrand.ly"}
// }).then(res => {
//     console.log(res)
// }))

// Store in Article field miniUrlDetails => {id: "string", shortUrl: "shortUrl"}

// rebrandlyApp.links.delete("asdfasf")
//     .then(res => {
//         console.log(res)
//     })
//     .catch(err => {
//         console.log(err)
//     })

/**
 * @param  {string} destination
 * @param  {string} articleId
 * @returns {object} shortUrl and url id Rebrandly Short URL generated
 */
exports.generateMiniLink = async ({ destination = "", articleId = "" }) => {
  const { shortUrl, id } = rebrandlyApp.links.create({
    destination,
    domain: { fullName: "rebrandly.ly" },
  });
  return {shortUrl, id};
};
