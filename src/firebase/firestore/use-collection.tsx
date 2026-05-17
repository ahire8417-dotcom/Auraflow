'use client';

import { useEffect, useState, useMemo } from 'react';
import { Query, onSnapshot, DocumentData, FirestoreError } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * useCollection - Stabilized collection listener hook.
 * Prevents infinite loops caused by inline query definitions.
 */
export function useCollection<T = DocumentData>(q: Query<T> | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  // Note: We depend on 'q' directly. 
  // IMPORTANT: The caller MUST memoize the query using useMemoFirebase or useMemo.
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
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
          path: 'Query Listener',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [q]); 

  return { data, loading, error };
}
