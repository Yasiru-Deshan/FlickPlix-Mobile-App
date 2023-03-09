const aws = require('aws-sdk');

aws.config.region = "us-east-2";
/*
 * Load the S3 information from the environment variables.
 */
const S3_BUCKET = process.env.S3_BUCKET;

const getSigendURL = async (req, res, next) => {
	try {
		const s3 = new aws.S3();
		const fileNam = req.query.filename;
		const fileTyp = req.query.filetype;
		console.log(`name ${fileNam} type ${fileTyp}`);
		const s3Params = {
			Bucket: S3_BUCKET,
			Key: fileNam,
			Expires: 60,
			ContentType: fileTyp,
			ACL: 'public-read'
		};
		s3.getSignedUrl('putObject', s3Params, (err, data) => {
			if (err) {
				console.log(err);
				return res.end();
			}
			const returnData = {
				signedRequest: data,
				url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileNam}`
			};

			res.write(JSON.stringify(returnData));
			res.end();
		});
	} catch (err) {
		console.error('server error' + err.message);
		return res.status(500).json({ msg: err });
	}
};

exports.getSigendURL = getSigendURL;
