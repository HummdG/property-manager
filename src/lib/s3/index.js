import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

const BUCKET = process.env.AWS_S3_BUCKET

/**
 * Generate a presigned URL for uploading a file to S3
 * @param {Object} params
 * @param {string} params.key - The S3 object key
 * @param {string} params.contentType - MIME type of the file
 * @param {number} [params.expiresIn] - URL expiration in seconds (default 600)
 * @returns {Promise<string>} The presigned upload URL
 */
export async function generatePresignedUploadUrl({ key, contentType, expiresIn = 600 }) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType
  })

  return getSignedUrl(s3Client, command, { expiresIn })
}

/**
 * Generate a presigned URL for downloading/viewing a file from S3
 * @param {string} key - The S3 object key
 * @param {number} [expiresIn] - URL expiration in seconds (default 3600)
 * @returns {Promise<string>} The presigned download URL
 */
export async function generatePresignedDownloadUrl(key, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key
  })

  return getSignedUrl(s3Client, command, { expiresIn })
}

/**
 * Delete an object from S3
 * @param {string} key - The S3 object key
 */
export async function deleteObject(key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key
  })

  await s3Client.send(command)
}

/**
 * Build the public URL for an S3 object
 * @param {string} key - The S3 object key
 * @returns {string} The public URL
 */
export function getPublicUrl(key) {
  const region = process.env.AWS_REGION || 'us-east-1'
  return `https://${BUCKET}.s3.${region}.amazonaws.com/${key}`
}

/**
 * Generate a unique S3 key for a property document
 * @param {string} propertyId
 * @param {string} docType - "DEED" or "NOC"
 * @param {string} originalName - Original file name
 * @returns {string} The S3 key
 */
export function generateDocumentKey(propertyId, docType, originalName) {
  const ext = originalName.split('.').pop()
  const timestamp = Date.now()
  return `properties/${propertyId}/documents/${docType.toLowerCase()}_${timestamp}.${ext}`
}

