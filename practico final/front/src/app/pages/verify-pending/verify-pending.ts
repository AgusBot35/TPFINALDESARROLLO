import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ToastComponent } from "../../shared/toast/toast";
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-pending',
  standalone: true,
  templateUrl: './verify-pending.html',
  styleUrl: './verify-pending.css',
  imports: [ToastComponent, RouterOutlet],
})
export class VerifyPendingPage{
  private toast = inject(ToastService)
    constructor(
        private route: ActivatedRoute,
        private authService: AuthService
    ) {}

  async resendVerificationEmail(): Promise<void> {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (!email) {
      this.toast.error('Email invalido');
      return;
    };
    await this.authService.resendVerificationEmail(email).subscribe();
    this.toast.success('Email reenviado')
  }
}