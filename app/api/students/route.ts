import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY "studentId"');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: '데이터를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { action, uid } = await request.json();
  
  if (action === 'reset') {
    try {
      await pool.query('UPDATE students SET attendance = false, "attendanceTime" = NULL');
      return NextResponse.json({ message: '초기화 완료' });
    } catch (error) {
      return NextResponse.json({ error: '출석을 초기화하는 중 오류가 발생했습니다.' }, { status: 500 });
    }
  } else if (action === 'updateAttendance') {
    try {
      const now = new Date().toISOString();
      const result = await pool.query(
        'UPDATE students SET attendance = true, "attendanceTime" = $1 WHERE uid = $2 RETURNING *',
        [now, uid]
      );
      if (result.rowCount! > 0) {
        return NextResponse.json({ message: '출석 업데이트 완료' });
      } else {
        return NextResponse.json({ error: '해당 UID를 가진 학생을 찾을 수 없습니다.' }, { status: 404 });
      }
    } catch (error) {
      return NextResponse.json({ error: '출석을 업데이트하는 중 오류가 발생했습니다.' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
}
