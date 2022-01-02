// Importing packages
const {nanoid} = require("nanoid");

/* 
* @params {string} title - of the page, default = "mkd-blog"
* @params {string} link - for files linking
* @returns {Object} page with properties of title and link
*/
const pageDetails = (title = "mkd-blog", link = "") => {
    const page = {}
    page.title = title;
    page.link = link;
    
    return {page};
};

// Error logging function. 
const errorLogger = (route = "", error) => {
    console.log(`Error at ${route} with error: ${error}`);
}

/* 
* @returns {string} random generated Id of specified length.
*/
const generateId = () => {
    const id = nanoid(parseInt(process.env.NANOID_LENGTH));
    return id;
}

/* 
* @params {RawData} from SQL DB.
* @returns {Object} Parsed data
*/
const parseData = (data) => {
    return JSON.parse(JSON.stringify(data));
}

/* 
* @params {string} email to be tested
* @returns {boolean} whether given string is email format or not
*/
const validateEmail = (text) => {
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegexp.test(text);
}

module.exports = {
    pageDetails,
    errorLogger,
    generateId,
    parseData,
    validateEmail,
}