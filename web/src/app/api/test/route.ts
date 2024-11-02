// app/api/test/route.ts
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test endpoint.
 *     responses:
 *       200:
 *         description: A test response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export async function GET() {
  return NextResponse.json({ success: true });
}
