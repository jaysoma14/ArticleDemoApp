const util = require('util');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { BadRequestError, PageNotFoundError } = require('../errors');
const storagePath = path.join(__dirname, "../../storage");

exports.validateImageFile = (fieldName, multiple = false) => {
    let fileFilter = (req, file, cb) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const message = `Only jpg, jpeg and png supported!`;
            return cb(new BadRequestError(message));
        }

        let extension = file.originalname.split(".");
        extension = extension[extension.length - 1];
        file.filename = `${Date.now()}.${extension}`;

        cb(null, true);
    };

    const multerObj = multer({
        storage: multer.memoryStorage(),
        fileFilter: fileFilter,
        limits: {
            fileSize: 1 * 1024 * 1024
        }
    });

    return multiple
        ? util.promisify(multerObj.array(fieldName, 10))
        : util.promisify(multerObj.single(fieldName))
}

exports.uploadFile = (container, fileName, buffer) => {
    fs.mkdirSync(storagePath + "/" + container + "/", { recursive: true }, () => { });
    return fs.writeFileSync(storagePath + "/" + container + "/" + fileName, buffer);
}

exports.removeFile = (filePath) => {
    try {
        fs.unlinkSync(storagePath + filePath);
    }
    catch (err) { }
}

exports.getFile = (filePath) => {
    try {
        return fs.readFileSync(storagePath + filePath);
    }
    catch (err) {
        throw new PageNotFoundError();
    }
}