/**
 * @swagger
 * tags:
 *   name: PhoneNumbers
 *   description: Phone number management
 */

import { Router, Request, Response } from "express";
import PhoneNumbersController from "../controllers/phone-number.js";
import mqConnection from "../rabbitmq/connection.js";

const router = Router();
/**
 * @swagger
 * /phone-numbers/:
 *   get:
 *     summary: Retrieve a list of phone numbers
 *     tags: [PhoneNumbers]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of records to return
 *     responses:
 *       200:
 *         description: A list of phone numbers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PhoneNumber'
 *       500:
 *         description: Server error
 */
router.get("/", async (req: Request, res: Response) => {
  const skip = parseInt(req.query.skip as string) || 0;
  const limit = parseInt(req.query.limit as string) || 100;
  const data = await PhoneNumbersController.findAll(skip, limit);
  res.json(data);
});

/**
 * @swagger
 * /phone-numbers/{countryCode}:
 *   get:
 *     summary: Retrieve phone numbers by country code
 *     tags: [PhoneNumbers]
 *     parameters:
 *       - in: path
 *         name: countryCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Country code to filter phone numbers
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of records to return
 *       - in: query
 *         name: mobileOnly
 *         schema:
 *           type: boolean
 *         description: Filter to only include mobile numbers if true
 *     responses:
 *       200:
 *         description: A list of phone numbers filtered by country code, along with the total count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PhoneNumber'
 *                 count:
 *                   type: integer
 *                   description: Total count of phone numbers matching the criteria
 *       404:
 *         description: Country code not found
 *       500:
 *         description: Server error
 */

router.get("/:countryCode", async (req: Request, res: Response) => {
  try {
    const countryCode = req.params.countryCode.toUpperCase();
    const mobileOnly = req.query.mobileOnly === "true";

    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 100;
    const data = await PhoneNumbersController.findAllByCountryCode(
      countryCode,
      skip,
      limit,
      mobileOnly
    );

    const count = await PhoneNumbersController.countByCountryCode(
      countryCode,
      mobileOnly
    );

    res.json({ data, count });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to retrieve data:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "Unexpected server error" });
    }
  }
});

/**
 * @swagger
 * /phone-numbers/generate:
 *   post:
 *     summary: Generate phone numbers
 *     tags: [PhoneNumbers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: valid
 *                 description: Type of phone number to generate ('valid' or 'random')
 *               number:
 *                 type: integer
 *                 example: 10
 *                 description: Number of phone numbers to generate
 *     responses:
 *       200:
 *         description: Phone numbers generation initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully queued 10 valid phone number generation requests.
 *       400:
 *         description: Bad request due to missing type or number
 *       500:
 *         description: Error sending messages to RabbitMQ
 */
router.post("/generate", async (req: Request, res: Response) => {
  const { type, number } = req.body;

  if (!type || !number) {
    return res
      .status(400)
      .json({ error: "Missing type or number of phones to generate" });
  }

  if (number > 5000) {
    return res.status(400).json({ error: "Number cannot be more than 5000" });
  }

  try {
    await mqConnection.connectRabbitMQ();
    for (let i = 0; i < number; i++) {
      await mqConnection.sendToQueue("NUMBER_GENERATOR_QUEUE", {
        id: i,
        type: type.toUpperCase(),
      });
    }
    res.status(200).json({
      message: `Successfully queued ${number} ${type} phone number generation requests.`,
    });
  } catch (error) {
    console.error("Failed to queue messages:", error);
    res.status(500).json({ error: "Failed to send messages to RabbitMQ" });
  }
});

export default router;
