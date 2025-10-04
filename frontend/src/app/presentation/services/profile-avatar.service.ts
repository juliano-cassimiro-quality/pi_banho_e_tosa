import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProfileAvatarService {
  private readonly storageKey = 'pi-profile-avatar';
  private readonly _avatar = signal<string | null>(this.readFromStorage());

  readonly avatar = computed(() => this._avatar());

  setAvatar(base64: string): void {
    this.persist(base64);
    this._avatar.set(base64);
  }

  clear(): void {
    this.removeFromStorage();
    this._avatar.set(null);
  }

  private readFromStorage(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    try {
      return window.localStorage.getItem(this.storageKey);
    } catch {
      return null;
    }
  }

  private persist(value: string): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(this.storageKey, value);
    } catch {
      /* noop */
    }
  }

  private removeFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.removeItem(this.storageKey);
    } catch {
      /* noop */
    }
  }
}
