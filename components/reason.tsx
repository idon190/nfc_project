'use client';

import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';


export function Reason() {
  const [studentName, setStudentName] = useState("");
  const [whatHappened, setWhatHappened] = useState("");
  const pb = new PocketBase('http://127.0.0.1:8090');

  async function updateWhatHappened() {
    console.log("검색할 이름:", studentName);
        const record = await pb.collection('students').getFirstListItem(`name="${studentName}"`);
        if (record) {
            // 결석 사유 업데이트
            await pb.collection('students').update(record.id, {
                whatHappened: whatHappened
            });
        }
    }

  return (
    <div>
      <h1>결석 사유 입력</h1>
      <input
          type="text"
          placeholder="이름을 입력하세요"
          value={studentName}
          onChange={(e) => {
            setStudentName(e.target.value);
          }}
      />
      <input
          type="text"
          placeholder="결석 사유를 입력하세요"
          value={whatHappened}
          onChange={(e) => {
            setWhatHappened(e.target.value);
          }}
      />
      <button onClick={updateWhatHappened}>제출</button>  
    </div>
  );
}
