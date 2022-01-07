exports.parseData = (data) => {
    JSON.parse(JSON.stringify(data));
}

exports.renderAppPage = ({res, renderTo = "", options: {
    page = {
        title: "",
        link: "",
    },
    status = 200,
    ...args
}}) => {
    res.status(status).render(renderTo, {...options});
}

