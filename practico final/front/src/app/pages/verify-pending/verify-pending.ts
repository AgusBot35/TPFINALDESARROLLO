import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-pending',
  standalone: true,
  templateUrl: './verify-pending.html',
  styleUrl: './verify-pending.css',
})
export class VerifyPendingPage implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private authService: AuthService
    ) {}
  ngOnInit() {}

  async resendVerificationEmail(): Promise<void> {
    const email = this.route.snapshot.queryParamMap.get('email');
    console.log('email:', email);
    if (!email) return;
    await this.authService.resendVerificationEmail(email).subscribe();
  }
}