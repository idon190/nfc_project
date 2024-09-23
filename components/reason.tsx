"use client"

import { useState } from "react"
import pool from '../utils/db'

export function Reason() {
    const [studentName, setStudentName] = useState("");
    const [whatHappened, setWhatHappened] = useState("");
    const [message, setMessage] = useState("");

    async function updateWhatHappened() {
        console.log("검색할 이름:", studentName);
        try {
            const result = await pool.query(
                'UPDATE students SET "whatHappened" = $1 WHERE name = $2 RETURNING *',
                [whatHappened, studentName]
            );

            if (result.rowCount! > 0) {
                setMessage("결석 사유가 성공적으로 업데이트되었습니다.");
                setStudentName("");
                setWhatHappened("");
            } else {
                setMessage("해당 이름의 학생을 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error('결석 사유 업데이트 오류:', error);
            setMessage("결석 사유를 업데이트하는 중 오류가 발생했습니다.");
        }
    }

    return (
        <div>
            <h1>결석 사유 입력</h1>
            <input
                type="text"
                placeholder="이름을 입력하세요"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
            />
            <input
                type="text"
                placeholder="결석 사유를 입력하세요"
                value={whatHappened}
                onChange={(e) => setWhatHappened(e.target.value)}
            />
            <button onClick={updateWhatHappened}>제출</button>
            {message && <p>{message}</p>}
        </div>
    )
}
