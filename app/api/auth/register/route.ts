import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const body = await req.json()
        const {fname, lname, email, pass} = body
        if (!email || !pass || !fname || !lname){
            return NextResponse.json({error: "fields not provided"},{status: 400})
        }
        
    } catch (error) {
        return NextResponse.json({error: "Failed to register user: "+error},{status: 500})
    }
}