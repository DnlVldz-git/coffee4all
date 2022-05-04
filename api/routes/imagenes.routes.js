
module.exports = app => {

    const adminOnly = require("../middleware/authMiddleware");
    const auth = require("../middleware/authMiddleware");
    var router = require("express").Router();
    const S3 = require("aws-sdk/clients/s3");
    const multer = require("multer");
    const upload = multer({ dest: "uploads/" });
    const crypto = require("crypto");
    const { promisify } = require("util");
    const randomBytes = promisify(crypto.randomBytes);

    const fs = require("fs");
    const path = require("path");

    const { Q_ACCESS_KEY_ID, Q_SECRET_ACCESS_KEY, Q_AWS_REGION, Q_S3_BUCKET } =
        process.env;

    const s3 = new S3({
        accessKeyId: Q_ACCESS_KEY_ID,
        secretAccessKey: Q_SECRET_ACCESS_KEY,
        region: Q_AWS_REGION,
    });

    router.post("/", adminOnly, upload.single("foto"), async (req, res) => {
        const stream = fs.createReadStream(req.file.path);

        const ext = path.extname(req.file.originalname).toLowerCase();

        let fileType = "";

        if (ext == ".png") {
            fileType = "image/png";
        } else if (ext == ".jpg" || ext == ".jpeg") {
            fileType = "image/jpg";
        } else {
            res.send({ data: "error" });
        }

        stream.on("error", function (err) {
            console.log("error in read stream: ", err);
            throw err;
        });

        const rawBytes = await randomBytes(16);
        const imageName = rawBytes.toString("hex");

        let params = {
            Bucket: Q_S3_BUCKET,
            Body: stream,
            Key: imageName,
            ContentType: fileType,
        };
        const data = await s3.upload(params).promise();

        res.send({ data: data.Key });
    });


    router.get("/:key", auth, async (req, res) => {
        const key = req.params.key;
        const imagen = await getImagen(key);
        res.send(imagen);
    });

    router.delete('/:key', adminOnly, async (req, res) => {
        try {
            const key = req.params.key;
            const data = await deleteImagen(key);
            res.send(data)
        }
        catch (err) {
            console.log(err.message);
        }

    });

    const getImagen = async (key) => {
        const url = s3.getSignedUrl('getObject', {
            Bucket: Q_S3_BUCKET,
            Key: key,
            Expires: 100000
        })
        return url;
    }

    deleteImagen = async (key) => {
        try {
            const bucketParams = { Bucket: Q_S3_BUCKET, Key: key };
            const data = await s3.deleteObject(bucketParams).promise().then(() => {
            }).catch(err => {
                console.log("errooor" + err);
            });
        } catch (err) {
            console.log("Error", err);
            return 'error';
        }
    };

    app.use('/imagenes/', router);
}