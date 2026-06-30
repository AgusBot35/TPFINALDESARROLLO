import { FormsModule } from "@angular/forms";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { ToastComponent } from "../../shared/toast/toast";
import { Component, inject, signal } from "@angular/core";
import { ToastService } from "../../services/toast.service";
import { firstValueFrom } from "rxjs";
import { UsersService } from "../../services/users.service";

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, ToastComponent, RouterOutlet],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})

export class ChangePasswordPage {
    loading = signal(false)
    private toast = inject(ToastService)
    private router = inject(Router)
    private userService = inject(UsersService)
    currentPassword = ''
    newPassword = ''


    async submit(): Promise<void> {
        this.loading.set(true);
    
        try {
          await firstValueFrom(this.userService.changePassword({newPassword: this.newPassword, currentPassword: this.currentPassword}));
          this.toast.success('Contraseña actualizada')
          this.router.navigate(['/profile']);
        } catch (err: any) {
          this.toast.error(err.error?.message || 'Error al cambiar la contraseña');
        } finally {
          this.loading.set(false);
        }
      }

}