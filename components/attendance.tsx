"use client"

import React, { useState, useEffect } from 'react';
import { createPool } from '@vercel/postgres';

const pool = createPool({
  connectionString: process.env.POSTGRES_URL_NO_SSL,
});

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
    studentId: number;
    name: string;
    attendance: boolean;
    attendanceTime: string | null;
    whatHappened: string | null;
    uid: string;
}

const { POSTGRES_URL } = process.env;

export function Attendance() {
    const [items, setItems] = useState<Student[]>([]);
    const [error, setError] = useState<string | undefined>();
    const [uid, setUid] = useState("");

    useEffect(() => {
        refresh();
    }, []);

    const refresh = async () => {
        try {
            const { rows } = await pool.query('SELECT * FROM students');
            setItems(rows.map((row: any) => ({
                id: row.id,
                studentId: row.student_id,
                name: row.name,
                attendance: row.attendance,
                attendanceTime: row.attendance_time,
                whatHappened: row.what_happened,
                uid: row.uid
            })));
        } catch (error) {
            console.error('데이터 가져오기 오류:', error);
            setError('데이터를 가져오는 중 오류가 발생했습니다.');
        }
    }

    async function reset(): Promise<void> {
        try {
            await pool.query('UPDATE students SET attendance = false, attendance_time = NULL, what_happened = NULL');
            refresh();
        } catch (error) {
            console.error('출석 초기화 오류:', error);
            setError('출석을 초기화하는 중 오류가 발생했습니다.');
        }
    }

    async function handleUpdateAttendance() {
        console.log("검색한 UID:", uid);
        try {
            await pool.query('UPDATE students SET attendance = true, attendance_time = NOW() WHERE uid = $1', [uid]);
            refresh();
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
            <button onClick={handleUpdateAttendance}>UID 지정 출석</button>
        </div>
    )
}
