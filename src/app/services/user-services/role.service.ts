import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = 'http://localhost:3000/api/user-roles';

  constructor(private http: HttpClient) { }


  // Get roles for a specific user
  getUserRoles(userId: number | null): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}/roles`);
  }

  // Get all users and their roles
  getAllUsersAndRoles(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // Add a role to a user
  addRoleToUser(userId: number, roleId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${userId}/roles/${roleId}`, {});
  }

  // Remove a role from a user
  removeRoleFromUser(userId: number, roleId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}/roles/${roleId}`);
  }

  // Update a user's roles
  updateUserRoles(userId: number, roleIds: number[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}/roles`, { roleIds });
  }
}
