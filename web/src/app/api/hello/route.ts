// app/api/hello/route.ts
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Returns a greeting message.
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello, World!
 */
export async function GET() {
  return NextResponse.json({ message: "Hello, World!" });
}
