import { Router } from "express"
import multer from "multer"
import path from "path"
import { UploadController } from "../controllers/upload.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { asyncHandler } from "../utils/asyncHandler"

const router = Router()
const uploadController = new UploadController()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads")
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const extension = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`)
  },
})

const fileFilter = (req: any, file: any, cb: any) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error("Invalid file type. Only images and documents are allowed."))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

// Apply authentication middleware
router.use(authMiddleware)

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload image file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post("/image", upload.single("image"), asyncHandler(uploadController.uploadImage.bind(uploadController)))

/**
 * @swagger
 * /api/upload/document:
 *   post:
 *     summary: Upload document file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 */
router.post(
  "/document",
  upload.single("document"),
  asyncHandler(uploadController.uploadDocument.bind(uploadController)),
)

/**
 * @swagger
 * /api/upload/multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 */
router.post("/multiple", upload.array("files", 5), asyncHandler(uploadController.uploadMultiple.bind(uploadController)))

/**
 * @swagger
 * /api/upload/{filename}:
 *   delete:
 *     summary: Delete uploaded file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 */
router.delete("/:filename", asyncHandler(uploadController.deleteFile.bind(uploadController)))

export default router
