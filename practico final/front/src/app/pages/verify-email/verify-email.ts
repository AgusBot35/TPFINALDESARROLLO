import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
  imports: [RouterLink],
})
export class VerifyEmailComponent implements OnInit {

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
        console.log('Correo verificado', res);
      },
      error: (err) => {
        console.error('Error al verificar', err);
      }
    });
  }
}