import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ShapeData } from './utils';
import { calculateAllIntersections } from './utils';

const API_BASE_URL = 'http://localhost:3000/api';
const STORAGE_KEY_USER_ID = 'konva_app_user_id';
const STORAGE_KEY_SHAPES = 'konva_app_shapes_data';

export function useCanvasSync() {
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [userId, setUserId] = useState<string>('');
  const isLoadedRef = useRef(false);

  // 1. Initialize User ID (Persistent without login)
  useEffect(() => {
    let id = localStorage.getItem(STORAGE_KEY_USER_ID);
    if (!id) {
      id = uuidv4();
      localStorage.setItem(STORAGE_KEY_USER_ID, id);
    }
    setUserId(id);
  }, []);

  // 2. Initial Load (Sync LocalStorage & DB)
  useEffect(() => {
    if (!userId || isLoadedRef.current) return;

    const initData = async () => {
      // Priority 1: Local Storage
      const localDataStr = localStorage.getItem(STORAGE_KEY_SHAPES);
      let localData: ShapeData[] = [];
      
      if (localDataStr) {
        try {
          localData = JSON.parse(localDataStr);
        } catch (e) {
          console.error("Failed to parse local storage", e);
        }
      }

      // Priority 2: Backend (Source of Truth if Local is empty)
      try {
        const response = await fetch(`${API_BASE_URL}/canvas/${userId}`);
        if (response.ok) {
          const remoteData = await response.json();
          const remoteShapes = Array.isArray(remoteData) ? remoteData : [];

          if (localData.length > 0) {
            // Local exists, use it. 
            // In a real app, we might compare timestamps, but per requirement: 
            // "jika ada perubahan local storage post ke backend"
            setShapes(localData);
            // Sync local to remote if they differ (simplified: always push local on first load if non-empty)
            // But better logic: only if remote is empty or older
            if (remoteShapes.length === 0) {
                saveToRemote(userId, localData);
            }
          } else if (remoteShapes.length > 0) {
            // Local empty, use Remote
            setShapes(remoteShapes);
            localStorage.setItem(STORAGE_KEY_SHAPES, JSON.stringify(remoteShapes));
          }
        }
      } catch (error) {
        console.error('Initial sync failed:', error);
        if (localData.length > 0) setShapes(localData);
      }
      
      isLoadedRef.current = true;
    };

    initData();
  }, [userId]);

  // 3. Save Data (Local & Remote Sync)
  useEffect(() => {
    if (!userId || !isLoadedRef.current) return;

    const syncChanges = async () => {
      // Per Requirement: "data yang disimpan di localstorage adalah nilai dari ∠A, ∠B, ∠C, ∠D ... radian ... area ... AB BC CD ..."
      // We already updated utils to include all these in the ShapeData object.
      
      // Calculate intersections to include them in the saved state as requested:
      // "termasuk juga pada objek yang overlaps maka nilai nya akan disimpan"
      const intersections = calculateAllIntersections(shapes);
      const fullState = [...shapes, ...intersections];

      // Save to Local
      localStorage.setItem(STORAGE_KEY_SHAPES, JSON.stringify(shapes)); // We only save source shapes to local to prevent doubling on reload

      // Save to Remote (Source + Intersections for Swagger/Analysis)
      saveToRemote(userId, fullState);
    };

    const timeoutId = setTimeout(syncChanges, 800); // Debounce
    return () => clearTimeout(timeoutId);
  }, [shapes, userId]);

  const saveToRemote = async (uid: string, data: ShapeData[]) => {
    try {
      await fetch(`${API_BASE_URL}/canvas/${uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error("Remote save failed", e);
    }
  };

  return { shapes, setShapes, userId };
}