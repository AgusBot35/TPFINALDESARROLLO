import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from "../../shared/toast/toast";

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, ToastComponent, RouterOutlet],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordPage implements OnInit {
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);
    toast = inject(ToastService)

    ngOnInit(): void {
        this.ForgotPassword();
    }
    
    async ForgotPassword(): Promise<void> {
        const email = this.route.snapshot.queryParamMap.get('email');
        console.log('email:', email);
        if (!email) {
            this.toast.error('Email invalido');
            return;
        }
        await this.authService.forgotPassword(email).subscribe();
        this.toast.success('Email de recuperacion enviado');
    }

    async resendForgotPasswordEmail(): Promise<void> {
        const email = this.route.snapshot.queryParamMap.get('email');
        console.log('email:', email);
        if (!email) {
            this.toast.error('Email invalido');
            return;
        }
        await this.authService.resendForgotPasswordEmail(email).subscribe();
        this.toast.success('Si el email existe, recibirás un link');
    }
}
