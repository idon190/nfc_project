'use client';

import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

export function Reason() {
  const [studentName, setStudentName] = useState("");
  const [whatHappened, setWhatHappened] = useState("");
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  async function updateWhatHappened() {
    console.log("검색할 이름:", studentName);
    const record = await pb.collection('students').getFirstListItem(`name="${studentName}"`);
    
    await pb.collection('students').update(record.id, {
      whatHappened: whatHappened
    });

    setStudentName("")
    setWhatHappened("")
    alert('결석 사유가 업데이트 되었습니다. 새로고침을 눌러주세요')

  }

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="reason-container">
      <h2 className="reason-title">결석 사유 입력</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="이름을 입력해주세요"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="uid-input"
        />
        <input
          type="text"
          placeholder="결석 사유를 입력해주세요"
          value={whatHappened}
          onChange={(e) => setWhatHappened(e.target.value)}
          className="uid-input"
        />
        <button onClick={updateWhatHappened} className="action-button">제출</button>
      </div>
    </div>
  );
}

const styles = `
.reason-container {
    position:
    font-family: Arial, sans-serif;
    max-width: 500px;
    margin: 0 auto;
    padding: 35px;
}

.reason-title {
    color: #333;
    text-align: center;
    margin-bottom: 20px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}

.uid-input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 200px;
}

.action-button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.action-button:hover {
    background-color: #45a049;
}
`;
