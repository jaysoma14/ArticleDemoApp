const { getFile } = require('../helphers/file-handling')

exports.getFile = async (req, res, next) => {
    try {
        const buffer = await getFile("/" + req.params.container + "/" + req.params.fileName);
        res.set('Content-type', 'image/png');
        res.send(buffer);
    } catch (error) {
        next(error);
    }
}