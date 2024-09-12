import {AfterContentChecked, Component, EventEmitter, Input, Output} from '@angular/core';
import {AdminService} from "../admin-dashboard/services/admin.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent{

  @Output() onInspect:EventEmitter<string> = new EventEmitter();

  constructor(public adminService: AdminService) {
  }




  inspectUser(username: string) {
    this.onInspect.emit(username);
  }

}
