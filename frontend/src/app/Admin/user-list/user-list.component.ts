import { Component } from '@angular/core';
import {AdminService} from "../admin-dashboard/services/admin.service";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {

  expandedUser: string | null = null;

  constructor(public adminService: AdminService) {
  }

  toggleExpand(username: string) {
    if (this.expandedUser === username) {
      this.expandedUser = null;
    } else {
      this.expandedUser = username;
    }
  }

  inspectUser(username: string, event: MouseEvent) {
    event.stopPropagation();
    console.log(`Inspecting user: ${username}`);
  }

}
