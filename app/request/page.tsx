import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

async function processAttendance(uid: string) {
  await pb.collection('students').update(uid, {
    attendance: true,
    attendanceTime: new Date().toISOString(),
  });

  return { message: '출석이 성공적으로 처리되었습니다.' };
}

interface AttendancePageProps {
  searchParams: { uid?: string };
}

export default async function AttendancePage(req: Request) {
  // POST 요청의 본문에서 UID를 가져옵니다.
  const { uid } = await req.json();

  if (uid === undefined) {
    return new Response('오류: 유효한 UID가 제공되지 않았습니다.', { status: 400 });
  }

  try {
    const result = await processAttendance(uid!);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('출석 처리 중 오류 발생:', error);
    return new Response(`오류: ${(error as Error).message}`, { status: 500 });
  }
}
