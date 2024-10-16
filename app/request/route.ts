
import PocketBase from 'pocketbase'

export async function POST(request: Request) {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const res = await request.json();

    try {
        const record = await pb.collection('students').getFirstListItem(`uid="${res.uid}"`)
        if (record) {
            const date = new Date().toISOString()
            const dateText = date[0] + " " + date[1].split('.')[0]
            await pb.collection('students').update(record.id, {
                attendance: true,
                attendanceTime: dateText
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