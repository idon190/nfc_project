import PocketBase from 'pocketbase';
import { NextApiRequest, NextApiResponse } from 'next';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

async function processAttendance(uid: string) {
  await pb.collection('students').update(uid, {
    attendance: true,
    attendanceTime: new Date().toISOString(),
  });

  return { message: '출석이 성공적으로 처리되었습니다.' };
}

export default async function AttendancePage(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않는 메서드입니다.' });
  }

  // POST 요청의 본문에서 UID를 가져옵니다.
  const { uid } = req.body;

  if (!uid || Array.isArray(uid)) {
    return res.status(400).json({ message: '오류: 유효한 UID가 제공되지 않았습니다.' });
  }

  try {
    const result = await processAttendance(uid);
    return res.status(200).json(result);
  } catch (error) {
    console.error('출석 처리 중 오류 발생:', error);
    return res.status(500).json({ message: `오류: ${(error as Error).message}` });
  }
}
