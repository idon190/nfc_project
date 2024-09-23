import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM reasons ORDER BY id');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: '사유를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { reason } = await request.json();
  try {
    const result = await pool.query('INSERT INTO reasons (reason) VALUES ($1) RETURNING *', [reason]);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: '사유를 추가하는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID가 제공되지 않았습니다.' }, { status: 400 });
  }
  try {
    await pool.query('DELETE FROM reasons WHERE id = $1', [id]);
    return NextResponse.json({ message: '사유가 삭제되었습니다.' });
  } catch (error) {
    return NextResponse.json({ error: '사유를 삭제하는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
