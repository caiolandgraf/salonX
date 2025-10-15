import { NextRequest, NextResponse } from 'next/server';
import { migrateCRMTables } from '@/lib/migrate-crm';

// POST - Executar migração do CRM
export async function POST(request: NextRequest) {
  try {
    const result = migrateCRMTables();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        clientsUpdated: result.clientsUpdated
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error running CRM migration:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao executar migração do CRM' 
      },
      { status: 500 }
    );
  }
}

// GET - Verificar status da migração
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      message: 'Use POST para executar a migração do CRM',
      endpoint: '/api/crm/migrate'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao verificar status da migração' },
      { status: 500 }
    );
  }
}
