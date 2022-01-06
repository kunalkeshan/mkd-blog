exports.parseData = (data) => {
    JSON.parse(JSON.stringify(data));
}

exports.renderAppPage = ({res, renderTo = "", options}) => {
    const {status = 200, page = {title: "", link: ""}, ...args} = options;
    res.status(status).render(renderTo, {...options});
}

