const path = require('path');
const fs = require('fs');
const config = require('../config');

const uploadsDir = path.join(__dirname, '../../uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

async function uploadEmergencyImage(file) {
  if (!file) return null;

  ensureUploadsDir();
  const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-').replace(/[^\w.-]/g, '')}`;
  const dest = path.join(uploadsDir, filename);
  fs.writeFileSync(dest, file.buffer);
  return `/uploads/${filename}`;
}

async function uploadEmergencyImageCloud(file) {
  if (!file) return null;

  const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
  const client = new S3Client({
    region: config.aws.region,
    credentials: {
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
    },
  });
  const key = `emergencies/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
  await client.send(
    new PutObjectCommand({
      Bucket: config.aws.s3Bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );
  return `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
}

async function saveEmergencyImage(file) {
  if (config.useAwsS3) {
    return uploadEmergencyImageCloud(file);
  }
  return uploadEmergencyImage(file);
}

module.exports = { saveEmergencyImage, ensureUploadsDir };
