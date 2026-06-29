import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordPage implements OnInit {
    private auth = inject(AuthService);
    private router = inject(Router);

    password = '';
    confirmPassword = '';
    error = '';
    loading = signal(false);

    ngOnInit(): void {
    }

    async submit(): Promise<void> {
    this.error = '';
    this.loading.set(true);
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      this.error = 'Token de verificación invalido';
      this.loading.set(false);
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      this.loading.set(false);
      return;
    }

    try {
      await firstValueFrom(this.auth.resetPassword( token, {password: this.password }));
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.error = err.error?.message || 'Error al cambiar la contraseña';
    } finally {
      this.loading.set(false);
    }
  }
}