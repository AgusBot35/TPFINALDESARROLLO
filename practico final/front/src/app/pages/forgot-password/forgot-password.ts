import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordPage implements OnInit {
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);

    ngOnInit(): void {
        this.ForgotPassword();
    }
    
    async ForgotPassword(): Promise<void> {
        const email = this.route.snapshot.queryParamMap.get('email');
        console.log('email:', email);
        if (!email) return;
        await this.authService.forgotPassword(email).subscribe();
    }

    async resendForgotPasswordEmail(): Promise<void> {
        const email = this.route.snapshot.queryParamMap.get('email');
        console.log('email:', email);
        if (!email) return;
        await this.authService.resendForgotPasswordEmail(email).subscribe();
    }
}
