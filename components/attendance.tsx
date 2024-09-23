"use client"

import { useState, useEffect } from "react"
import pool from '../utils/db'

const th = {
    border: '1px solid black',
    padding: '8px',
}

const td = {
    border: '1px solid black',
    padding: '8px',
}

interface Student {
    id: string;
    studentId: string;
    name: string;
    attendance: boolean;
    attendanceTime: string | null;
    whatHappened: string | null;
    uid: string;
}

export function Attendance() {
    const [items, setItems] = useState<Student[]>([]);
    const [error, setError] = useState<string | undefined>();
    const [uid, setUid] = useState("");

    useEffect(() => {
        refresh();
    }, []);

    const refresh = async () => {
        try {
            const result = await pool.query('SELECT * FROM students ORDER BY "studentId"');
            setItems(result.rows);
        } catch (error) {
            console.error('데이터 가져오기 오류:', error);
            setError('데이터를 가져오는 중 오류가 발생했습니다.');
        }
    }

    async function reset(): Promise<void> {
        try {
            await pool.query('UPDATE students SET attendance = false, "attendanceTime" = NULL');
            refresh();
        } catch (error) {
            console.error('출석 초기화 오류:', error);
            setError('출석을 초기화하는 중 오류가 발생했습니다.');
        }
    }

    async function updateAttendance() {
        console.log("검색한 UID:", uid);
        try {
            const now = new Date().toISOString();
            const result = await pool.query(
                'UPDATE students SET attendance = true, "attendanceTime" = $1 WHERE uid = $2 RETURNING *',
                [now, uid]
            );
            if (result.rowCount! > 0) {
                refresh();
            } else {
                setError('해당 UID를 가진 학생을 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('출석 업데이트 오류:', error);
            setError('출석을 업데이트하는 중 오류가 발생했습니다.');
        }
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
