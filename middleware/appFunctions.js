const {nanoid} = require("nanoid");

const pageDetails = (title = "mkd-blog", link = "") => {
    const page = {}
    page.title = title;
    page.link = link;
    
    return {page};
};

const errorLogger = (route = "", error) => {
    console.log(`Error at ${route} with error: ${error}`);
}

const generateId = () => {
    const id = nanoid(parseInt(process.env.NANOID_LENGTH));
    return id;
}

module.exports = {
    pageDetails,
    errorLogger,
    generateId,
}