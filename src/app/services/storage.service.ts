import { Injectable } from '@angular/core';

const LOCAL_STORAGE_KEY = 'drawing-pad';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  getStoredShapes() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (error) {
        console.log(error);
      }
    }
    return [];
  }

  removeStoredShapes() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}
