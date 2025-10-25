import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phone, dateOfBirth, gender, address, city, state, pincode } = body

    const user = await sql`
      INSERT INTO railway_users (
        full_name, email, phone, date_of_birth, gender, address, city, state, pincode
      ) VALUES (
        ${fullName}, ${email}, ${phone}, ${dateOfBirth}, ${gender}, ${address}, ${city}, ${state}, ${pincode}
      )
      RETURNING *
    `

    return NextResponse.json({ user: user[0] })
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const user = await sql`
      SELECT * FROM railway_users WHERE email = ${email}
    `

    return NextResponse.json({ user: user[0] || null })
  } catch (error) {
    console.error("[v0] Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
