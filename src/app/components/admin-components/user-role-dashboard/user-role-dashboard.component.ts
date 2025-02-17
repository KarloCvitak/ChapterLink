import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../../services/user-services/role.service'; // Adjust the path as necessary

@Component({
  selector: 'app-user-role-dashboard',
  templateUrl: './user-role-dashboard.component.html',
  styleUrls: ['./user-role-dashboard.component.css']
})
export class UserRoleDashboardComponent implements OnInit {

  users: any[] = [];
  roles: any[] = [
    { role_id: 1, role_name: 'Admin' },
    { role_id: 2, role_name: 'User' }
  ];
  selectedRoleId: number = 2; // Default to 'User' role

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.loadUsersAndRoles();
  }

  loadUsersAndRoles() {
    this.roleService.getAllUsersAndRoles().subscribe(
      data => {
        this.users = data.users;
      },
      error => {
        console.error('Error fetching users and roles', error);
      }
    );
  }

  addRole(userId: number) {
    this.roleService.addRoleToUser(userId, this.selectedRoleId).subscribe(
      response => {
        console.log('Role added', response);
        this.loadUsersAndRoles(); // Reload the data to see the changes
      },
      error => {
        console.error('Error adding role', error);
      }
    );
  }

  removeRole(userId: number, roleId: number) {
    this.roleService.removeRoleFromUser(userId, roleId).subscribe(
      response => {
        console.log('Role removed', response);
        this.loadUsersAndRoles(); // Reload the data to see the changes
      },
      error => {
        console.error('Error removing role', error);
      }
    );
  }
}
