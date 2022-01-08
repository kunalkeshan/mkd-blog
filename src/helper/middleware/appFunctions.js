exports.parseData = (data) => {
    JSON.parse(JSON.stringify(data));
}

/**
 * @param  {Object} res Response Object
 * @param  {String} renderTo Which ejs file to render
 * @param  {Object} options Other options to pass into render method
     * @param  {Object} page File details of the file to be rendered
         * @param  {String} title Title of the file
         * @param  {String} link link - document names to link with script and link tags
     * @param  {Number} status Response status default 200 
     * @param  {Object} args Other arguments, if required is spread
 */
exports.renderAppPage = ({res, renderTo = "", options}) => {
    const { status = 200 } = options;
    res.status(status).render(renderTo, {...options});
}

