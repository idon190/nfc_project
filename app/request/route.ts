
import PocketBase from 'pocketbase'

export async function POST(request: Request) {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const res = await request.json();

    try {
        const record = await pb.collection('students').getFirstListItem(`uid="${res.uid}"`)
        if (record) {

            await pb.collection('students').update(record.id, {
                attendance: true,
                attendanceTime: new Date().toISOString()
            });

        }
    } catch (error) {
        console.error(error);
    }



    return new Response(JSON.stringify({}), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 201,
    });
}