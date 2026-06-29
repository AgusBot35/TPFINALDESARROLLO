import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastComponent } from "../../shared/toast/toast";
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, ToastComponent, RouterOutlet],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordPage{
    private auth = inject(AuthService);
    private router = inject(Router);
    private toast = inject(ToastService)

    password = '';
    confirmPassword = '';
    error = '';
    loading = signal(false);

    async submit(): Promise<void> {
    this.loading.set(true);
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      this.toast.error('Token de verificación invalido');
      this.loading.set(false);
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toast.error('Las contraseñas no coinciden');
      this.loading.set(false);
      return;
    }

    try {
      await firstValueFrom(this.auth.resetPassword( token, {password: this.password }));
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al cambiar la contraseña');
    } finally {
      this.loading.set(false);
    }
  }
}