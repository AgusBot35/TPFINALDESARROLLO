import { Component, inject, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink, RouterOutlet } from "@angular/router";
import { ToastComponent } from "../../shared/toast/toast";
import { firstValueFrom } from "rxjs";
import { UsersService } from "../../services/users.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [FormsModule, RouterLink, ToastComponent, RouterOutlet],
  templateUrl: './change-email.html',
  styleUrls: ['./change-email.css'],
})
export class ChangeEmailPage {
  newEmail = '';
  password = '';
  private _loading = false;

  private userService = inject(UsersService)
  private toast = inject(ToastService)


  loading() {
    return this._loading;
  }

  async submit() {
    if (!this.newEmail || !this.password) return;
    this._loading = true;
    try {
      const message = await firstValueFrom(this.userService.changeEmail({newEmail: this.newEmail, password: this.password}))
    } catch (e) {
      this.toast.error('Credenciales invalidas');
    } finally {
      this._loading = false;
    }
  }
}