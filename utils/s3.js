"use strict";
exports.__esModule = true;
exports.getFileStream = exports.upload = exports.s3 = void 0;
var s3_1 = require("aws-sdk/clients/s3");
var fs_1 = require("fs");
exports.s3 = new s3_1["default"]({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
var upload = function (file) {
    var fileStream = fs_1["default"].createReadStream(file.path);
    var uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fileStream,
        Key: file.filename
    };
    return exports.s3.upload(uploadParams).promise();
};
exports.upload = upload;
var getFileStream = function (fileKey) {
    var downloadParams = {
        Key: fileKey,
        Bucket: process.env.AWS_BUCKET_NAME
    };
    return exports.s3.getObject(downloadParams).createReadStream();
};
exports.getFileStream = getFileStream;
