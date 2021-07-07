import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string | null): boolean {
    console.log('isTokenExpired', jwt_decode(token || ''));
    const decoded: { exp: number } = jwt_decode(token || '');
    return token ? Date.now() < Number(decoded.exp) : false;
  }
}
