import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-pending',
  standalone: true,
  templateUrl: './verify-pending.html'
})
export class VerifyPendingPage implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private authService: AuthService
    ) {}
  ngOnInit() {}
}