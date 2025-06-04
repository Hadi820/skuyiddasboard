import type { Request, Response, NextFunction } from "express"

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>

/**
 * Wraps an async function to catch errors and pass them to the next middleware
 * @param fn Async function to wrap
 */
export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
