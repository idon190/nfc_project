
import PocketBase from 'pocketbase'

function dateText() {
    const date = Date().split(" ")
    /*
    [0] : 요일 
    [1] : 월(문자)
    [2] : 일
    [3] : 년
    [4] : 시간
    */
    const dateText = date[3]     //년
        + "-"                    //-
        + monthToNumber(date[1]) //월(숫자)
        + "-"                    //-
        + date[2]                //일
        + " "                    //공백
        + date[4]                //시간(00:00:00)
    return dateText
}

function monthToNumber(month: string) {
    return new Date(Date.parse(month + " 1, 2012")).getMonth() + 1
}

export async function POST(request: Request) {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const res = await request.json();

    try {
        const record = await pb.collection('students').getFirstListItem(`uid="${res.uid}"`)
        if (record) {

            await pb.collection('students').update(record.id, {
                attendance: true,
                attendanceTime: dateText()
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