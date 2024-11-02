import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { tokenAllocatioValidation } from '../../validations';
import { tokenAllocationController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .get(validate(tokenAllocatioValidation.getTokenAllocations), tokenAllocationController.getTokenAllocations);

router
  .route('/:tokenAllocationId')
  .get(validate(tokenAllocatioValidation.getTokenAllocation), tokenAllocationController.getTokenAllocation)

export default router;

/**
 * @swagger
 * tags:
 *   name: Token Allocation
 *   description: Token Allocation management and retrieval
 */

/**
 * @swagger
 * /token-allocations:
 *   get:
 *     summary: Get all Token Allocations
 *     description: Anyone can retrive Token Allocation.
 *     tags: [TokenAllocations]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *         description: Outcome ID
 *       - in: query
 *         name: amount
 *         schema:
 *           type: number
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *       - in: query
 *         name: outcomeId
 *         schema:
 *           type: number
 *       - in: query
 *         name: total_liquidity
 *         schema:
 *           type: number
 *       - in: query
 *         name: updatedAt
 *         schema:
 *           type: date
 *         description: Outcome created on date
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TokenAllocation'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /token-allocations/{id}:
 *   get:
 *     summary: Get a Token Allocation
 *     description: Anyone can retrieve Token Allocation detail
 *     tags: [TokenAllocations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Token Allocation id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/TokenAllocation'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */