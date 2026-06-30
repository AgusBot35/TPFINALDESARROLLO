import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  private router = inject(Router);
  user = this.auth.getUser();

  maskEmail(): string {
    const [user, domain] = this.user()!.email.split('@');
    return `${user[0]}***${user[user.length - 1]}@${domain}`;
  }
}
