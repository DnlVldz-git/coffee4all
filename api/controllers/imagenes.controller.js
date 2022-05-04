const db = require("../models");
const S3Service = require("../services/s3.service");

exports.upload = (req, res) => {    
    S3Service.upload("/uploads", req.body.file.name, )
};