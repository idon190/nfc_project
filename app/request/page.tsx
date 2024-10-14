import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

async function processAttendance(uid: string) {
  
    await pb.collection('students').update(uid, {
        attendance: true,
        attendanceTime: new Date().toISOString(),
    });

    return { message: '출석이 성공적으로 처리되었습니다.'};
  
}

interface AttendancePageProps {
  searchParams: { uid?: string | string[] };
}

export default async function AttendancePage({ searchParams }: AttendancePageProps) {
  // searchParams에서 UID를 가져옵니다.
  const uid = searchParams.uid;

  if (!uid || Array.isArray(uid)) {
    return new Response('오류: 유효한 UID가 제공되지 않았습니다.', { status: 400 });
  }

  try {
    const result = await processAttendance(uid);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`오류: ${(error as Error).message}`, { status: 500 });
  }
}

// POST 요청을 처리하기 위한 핸들러 추가
export const config = {
  api: {
    bodyParser: true,
  },
};
