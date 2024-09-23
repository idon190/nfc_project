'use server';

import pool from '@/utils/db';

export async function getStudents() {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY "studentId"');
    return result.rows;
  } catch (error) {
    console.error('학생 데이터를 가져오는 중 오류 발생:', error);
    throw new Error('학생 데이터를 가져오는 중 오류가 발생했습니다.');
  }
}

export async function resetAttendance() {
  try {
    await pool.query('UPDATE students SET attendance = false, "attendanceTime" = NULL');
    return { message: '초기화 완료' };
  } catch (error) {
    console.error('출석 초기화 중 오류 발생:', error);
    throw new Error('출석을 초기화하는 중 오류가 발생했습니다.');
  }
}

export async function updateAttendance(uid: string) {
  try {
    const now = new Date().toISOString();
    const result = await pool.query(
      'UPDATE students SET attendance = true, "attendanceTime" = $1 WHERE uid = $2 RETURNING *',
      [now, uid]
    );
    if (result.rowCount! > 0) {
      return { message: '출석 업데이트 완료' };
    } else {
      throw new Error('해당 UID를 가진 학생을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('출석 업데이트 중 오류 발생:', error);
    throw new Error('출석을 업데이트하는 중 오류가 발생했습니다.');
  }
}

export async function getReasons() {
  try {
    const result = await pool.query('SELECT * FROM reasons ORDER BY id');
    return result.rows;
  } catch (error) {
    console.error('사유를 가져오는 중 오류 발생:', error);
    throw new Error('사유를 가져오는 중 오류가 발생했습니다.');
  }
}

export async function addReason(reason: string) {
  try {
    const result = await pool.query('INSERT INTO reasons (reason) VALUES ($1) RETURNING *', [reason]);
    return result.rows[0];
  } catch (error) {
    console.error('사유 추가 중 오류 발생:', error);
    throw new Error('사유를 추가하는 중 오류가 발생했습니다.');
  }
}

export async function deleteReason(id: number) {
  try {
    await pool.query('DELETE FROM reasons WHERE id = $1', [id]);
    return { message: '사유가 삭제되었습니다.' };
  } catch (error) {
    console.error('사유 삭제 중 오류 발생:', error);
    throw new Error('사유를 삭제하는 중 오류가 발생했습니다.');
  }
}
