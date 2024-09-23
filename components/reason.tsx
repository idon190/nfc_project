'use client';

import React, { useState, useEffect } from 'react';
import { createPool } from '@vercel/postgres';

const pool = createPool({
  connectionString: process.env.POSTGRES_URL_NO_SSL,
});

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
      const { rows } = await pool.query('SELECT * FROM reasons ORDER BY id');
      setReasons(rows.map(row => ({ id: row.id, reason: row.reason })));
    } catch (error) {
      console.error('사유 가져오기 오류:', error);
      setError('사유를 가져오는 중 오류가 발생했습니다.');
    }
  };

  const handleAddReason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReason.trim()) return;

    try {
      const { rows } = await pool.query(
        'INSERT INTO reasons (reason) VALUES ($1) RETURNING id, reason',
        [newReason]
      );
      const newReasonData = rows[0] as Reason;
      setReasons([...reasons, newReasonData]);
      setNewReason('');
    } catch (error) {
      console.error('사유 추가 오류:', error);
      setError('사유를 추가하는 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteReason = async (id: number) => {
    try {
      await pool.query('DELETE FROM reasons WHERE id = $1', [id]);
      setReasons(reasons.filter(reason => reason.id !== id));
    } catch (error) {
      console.error('사유 삭제 오류:', error);
      setError('사유를 삭제하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2>결석 사유 관리</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddReason}>
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
            <button onClick={() => handleDeleteReason(reason.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
