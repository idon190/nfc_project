"use client"

import Pocketbase, { RecordModel } from "pocketbase"
import { useState, useEffect } from "react"

const th = {
    border: '1px solid black',
    padding: '8px',
}

const td = {
    border: '1px solid black',
    padding: '8px',
}

export function Attendance() {
    const [items, setItems] = useState<RecordModel[]>([]);
    const [error, setError] = useState();
    const [uid, setUid] = useState("");
    const pb = new Pocketbase('http://localhost:8090')

    useEffect(() => {
        refresh();
    }, []);

    const refresh = async () => {
        try {
            const response = await pb.collection('students').getList(1, 50, {
                sort: '+studentId',
            });
            setItems(response.items);
            console.log(response.items)
        } catch (error) {
            console.error('데이터 가져오기 오류:', error);
        }
    }

    async function reset(): Promise<void> {
        try {
            for (const item of items) {
                await pb.collection('students').update(item.id, {
                    attendance: false,
                    attendanceTime: null,
                });
            }
        } catch (error) {
            console.error('출석 초기화 오류:', error);
        }
        refresh();
    }

    async function updateAttendance() {
        console.log("검색한 UID:", uid);
        const record = await pb.collection('students').getFirstListItem(`uid="${uid}"`);
        if (record) {
            // 출석 기록 업데이트
            const now = new Date();
            await pb.collection('students').update(record.id, {
                attendance: true,
                attendanceTime: now.toISOString()
            });
        }
        refresh();
    }

    return (
        <div>
            <h2>학생 목록</h2>
            {error ? (
                <p>{error}</p>
            ) : (
                <table style={{ width: '70%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={th}>학번</th>
                            <th style={th}>이름</th>
                            <th style={th}>출석 상태</th>
                            <th style={th}>출석 일자</th>
                            <th style={th}>결석 사유</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td style={td}>{item.studentId}</td>
                                <td style={td}>{item.name}</td>
                                <td style={td}>
                                    <span style={{ color: item.attendance ? "green" : "red" }}>
                                        {item.attendance ? "출석" : "결석"}
                                    </span>
                                </td>
                                <td style={td}>
                                    {item.attendanceTime ? item.attendanceTime.split('.')[0] : '기록 되지 않음'}
                                </td>
                                <td style={td}>
                                    {item.whatHappened ? item.whatHappened : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button onClick={refresh}>새로고침</button>
            <button onClick={reset}>초기화</button>
            <p></p>
            <input
                type="text"
                placeholder="UID를 입력하세요"
                value={uid}
                onChange={(e) => {
                    setUid(e.target.value);
                    refresh();
                }}
            />
            <button onClick={updateAttendance}>UID 지정 출석</button>
        </div>
    )
}
