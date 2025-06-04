import { Router } from "express"
import { ClientController } from "../controllers/client.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { validateClient, validateClientUpdate } from "../middleware/validation.middleware"
import { asyncHandler } from "../utils/asyncHandler"

const router = Router()
const clientController = new ClientController()

// Apply authentication middleware
router.use(authMiddleware)

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive]
 *         description: Filter by status
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search in name, email, phone, company
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: List of clients
 */
router.get("/", asyncHandler(clientController.getAllClients.bind(clientController)))

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client details
 *       404:
 *         description: Client not found
 */
router.get("/:id", asyncHandler(clientController.getClientById.bind(clientController)))

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create new client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClientDto'
 *     responses:
 *       201:
 *         description: Client created successfully
 */
router.post("/", validateClient, asyncHandler(clientController.createClient.bind(clientController)))

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateClientDto'
 *     responses:
 *       200:
 *         description: Client updated successfully
 */
router.put("/:id", validateClientUpdate, asyncHandler(clientController.updateClient.bind(clientController)))

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client deleted successfully
 */
router.delete("/:id", asyncHandler(clientController.deleteClient.bind(clientController)))

/**
 * @swagger
 * /api/clients/{id}/reservations:
 *   get:
 *     summary: Get client reservations
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client reservations
 */
router.get("/:id/reservations", asyncHandler(clientController.getClientReservations.bind(clientController)))

export default router
