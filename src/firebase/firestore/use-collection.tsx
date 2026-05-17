'use client';

import { useEffect, useState, useMemo } from 'react';
import { Query, onSnapshot, DocumentData, FirestoreError, query } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * useCollection - High-performance stabilized collection listener hook.
 */
export function useCollection<T = DocumentData>(q: Query<T> | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  // Stabilize the subscription using a internal unique ID or hash
  // For simplicity, we assume the caller memoizes 'q'.
  useEffect(() => {
    if (!q) {
      setLoading(false);
      setData([]);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as T));
        setData(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        if (err.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: 'Restricted Collection',
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
        }
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [q]); 

  return { data, loading, error };
}