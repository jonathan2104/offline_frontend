import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncypteService {

  constructor() {}

  private toBase64(str: string): string {
    return btoa(unescape(encodeURIComponent(str)));
  }

  private fromBase64(b64: string): string {
    return decodeURIComponent(escape(atob(b64)));
  }

  /**
   * Encrypt data with userId as the key
   */
  encryptData(data: any, userId: any): string {
    const json = JSON.stringify(data);
    let encrypted = '';

    for (let i = 0; i < json.length; i++) {
      encrypted += String.fromCharCode(
        json.charCodeAt(i) ^ userId.charCodeAt(i % userId.length)
      );
    }

    return this.toBase64(encrypted);
  }

  /**
   * Decrypt data — will throw error if wrong userId
   */
  decryptData(encryptedData: string, userId: string): any {
    try {
      const decoded = this.fromBase64(encryptedData);
      let decrypted = '';

      for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(
          decoded.charCodeAt(i) ^ userId.charCodeAt(i % userId.length)
        );
      }

      // If wrong userId — JSON.parse will fail
      return JSON.parse(decrypted);
    } catch (e) {
      throw new Error('Invalid userId or corrupted data');
    }
  }
}