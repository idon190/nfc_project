'use client';

import React, { useState, useEffect } from 'react';

interface Reason {
  id: number;
  reason: string;
}

export function Reason() {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [newReason, setNewReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReasons();
  }, []);

  const fetchReasons = async () => {
    try {
      const response = await fetch('/api/reasons');
      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
      const data = await response.json();
      setReasons(data);
    } catch (error) {
      console.error('사유 가져오기 오류:', error);
      setError('사유를 가져오는 중 오류가 발생했습니다.');
    }
  };

  const addReason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReason.trim()) return;

    try {
      const response = await fetch('/api/reasons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: newReason }),
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

      const addedReason = await response.json();
      setReasons([...reasons, addedReason]);
      setNewReason('');
    } catch (error) {
      console.error('사유 추가 오류:', error);
      setError('사유를 추가하는 중 오류가 발생했습니다.');
    }
  };

  const deleteReason = async (id: number) => {
    try {
      const response = await fetch(`/api/reasons?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

      setReasons(reasons.filter(reason => reason.id !== id));
    } catch (error) {
      console.error('사유 삭제 오류:', error);
      setError('사유를 삭제하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2>사유 관리</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={addReason}>
        <input
          type="text"
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
          placeholder="새 사유 입력"
        />
        <button type="submit">추가</button>
      </form>
      <ul>
        {reasons.map((reason) => (
          <li key={reason.id}>
            {reason.reason}
            <button onClick={() => deleteReason(reason.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
