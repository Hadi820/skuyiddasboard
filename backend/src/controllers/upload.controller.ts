import type { Request, Response } from "express"
import fs from "fs/promises"
import path from "path"
import type { ApiResponse } from "../types/api.types"
import { logger } from "../utils/logger"
import type Express from "express" // Import Express to fix the undeclared variable error

export class UploadController {
  /**
   * Upload single image
   */
  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: "No image file provided",
        })
        return
      }

      const fileUrl = `/uploads/${req.file.filename}`

      logger.info(`Image uploaded: ${req.file.filename}`, {
        userId: req.user?.id,
        originalName: req.file.originalname,
        size: req.file.size,
      })

      const response: ApiResponse = {
        success: true,
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          url: fileUrl,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
        message: "Image uploaded successfully",
      }

      res.status(200).json(response)
    } catch (error) {
      logger.error("Upload image error:", error)
      res.status(500).json({
        success: false,
        error: "Failed to upload image",
        message: error instanceof Error ? error.message : "Upload failed",
      })
    }
  }

  /**
   * Upload single document
   */
  async uploadDocument(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: "No document file provided",
        })
        return
      }

      const fileUrl = `/uploads/${req.file.filename}`

      logger.info(`Document uploaded: ${req.file.filename}`, {
        userId: req.user?.id,
        originalName: req.file.originalname,
        size: req.file.size,
      })

      const response: ApiResponse = {
        success: true,
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          url: fileUrl,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
        message: "Document uploaded successfully",
      }

      res.status(200).json(response)
    } catch (error) {
      logger.error("Upload document error:", error)
      res.status(500).json({
        success: false,
        error: "Failed to upload document",
        message: error instanceof Error ? error.message : "Upload failed",
      })
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[]

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          error: "No files provided",
        })
        return
      }

      const uploadedFiles = files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        url: `/uploads/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype,
      }))

      logger.info(`Multiple files uploaded: ${files.length} files`, {
        userId: req.user?.id,
        filenames: files.map((f) => f.filename),
      })

      const response: ApiResponse = {
        success: true,
        data: uploadedFiles,
        message: `${files.length} files uploaded successfully`,
      }

      res.status(200).json(response)
    } catch (error) {
      logger.error("Upload multiple files error:", error)
      res.status(500).json({
        success: false,
        error: "Failed to upload files",
        message: error instanceof Error ? error.message : "Upload failed",
      })
    }
  }

  /**
   * Delete uploaded file
   */
  async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const { filename } = req.params
      const filePath = path.join(process.cwd(), "uploads", filename)

      // Check if file exists
      try {
        await fs.access(filePath)
      } catch {
        res.status(404).json({
          success: false,
          error: "File not found",
        })
        return
      }

      // Delete file
      await fs.unlink(filePath)

      logger.info(`File deleted: ${filename}`, {
        userId: req.user?.id,
      })

      const response: ApiResponse = {
        success: true,
        message: "File deleted successfully",
      }

      res.status(200).json(response)
    } catch (error) {
      logger.error("Delete file error:", error)
      res.status(500).json({
        success: false,
        error: "Failed to delete file",
        message: error instanceof Error ? error.message : "Delete failed",
      })
    }
  }
}
