import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastComponent } from "../../shared/toast/toast";
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
  imports: [RouterLink, ToastComponent, RouterOutlet],
})
export class VerifyEmailComponent implements OnInit {
  private toast = inject(ToastService)
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

    private router = inject(Router);
  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) return;

    this.authService.verifyEmail(token).subscribe({
      next: (res) => {
        this.toast.success('Email verificado correctamente');
      },
      error: (err) => {
        this.toast.error('Token inválido o expirado');
      }
    });
  }
}