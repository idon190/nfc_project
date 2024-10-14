
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

async function processAttendance(uid: string) {

  const record = await pb.collection('students').getFirstListItem(`uid="${uid}"`);

  await pb.collection('students').update(record.uid, {
    attendance: true,
    attendanceTime: new Date().toISOString(),
  });

  return { message: '출석이 성공적으로 처리되었습니다.' };

}

interface AttendancePageProps {
  searchParams: { uid?: string };
}

export default async function AttendancePage({ searchParams }: AttendancePageProps) {
  // searchParams에서 UID를 가져옵니다.
  const uid = searchParams.uid;

  if (uid === undefined) {
    alert('잘못된 UID 입니다.')
  }

  try {
    const result = await processAttendance(uid!);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`오류: ${(error as Error).message}`, { status: 500 });
  }
}
