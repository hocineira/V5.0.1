import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request, { params }) {
  try {
    const filename = params.filename
    const filePath = path.join(process.cwd(), 'public', 'procedures', filename)
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
    }
    
    // Lire le fichier PDF
    const fileBuffer = fs.readFileSync(filePath)
    
    // Créer une réponse avec les bons en-têtes CORS
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': "frame-ancestors 'self' *",
        'Cache-Control': 'public, max-age=3600'
      }
    })
    
    return response
  } catch (error) {
    console.error('Error serving PDF:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}