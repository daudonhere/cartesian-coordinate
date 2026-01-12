import { useState, useEffect, useRef } from 'react';
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

  useEffect(() => {
    let id = localStorage.getItem(STORAGE_KEY_USER_ID);
    if (!id) {
      id = uuidv4();
      localStorage.setItem(STORAGE_KEY_USER_ID, id);
    }
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId || isLoadedRef.current) return;

    const initData = async () => {
      const localDataStr = localStorage.getItem(STORAGE_KEY_SHAPES);
      let localData: ShapeData[] = [];
      
      if (localDataStr) {
        try {
          localData = JSON.parse(localDataStr);
        } catch (e) {
          console.error("Failed to parse local storage", e);
        }
      }

      try {
        const response = await fetch(`${API_BASE_URL}/canvas/${userId}`);
        if (response.ok) {
          const remoteData = await response.json();
          const remoteShapes = Array.isArray(remoteData) ? remoteData : [];

          if (localData.length > 0) {
            setShapes(localData);
            if (remoteShapes.length === 0) {
                saveToRemote(userId, localData);
            }
          } else if (remoteShapes.length > 0) {
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

  useEffect(() => {
    if (!userId || !isLoadedRef.current) return;

    const syncChanges = async () => {
      const intersections = calculateAllIntersections(shapes);
      const fullState = [...shapes, ...intersections];

      localStorage.setItem(STORAGE_KEY_SHAPES, JSON.stringify(shapes)); 

      saveToRemote(userId, fullState);
    };

    const timeoutId = setTimeout(syncChanges, 800); 
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
