import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastMessage, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnInit, OnDestroy {
  currentToast: ToastMessage | null = null;
  visible = false;

  private subscription = new Subscription();
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private animationTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.toastService.toasts.subscribe((toast) => {
        if (toast) {
          this.show(toast);
        } else {
          this.hide();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.clearTimers();
  }

  dismiss(): void {
    this.toastService.clear();
  }

  private show(toast: ToastMessage): void {
    this.clearTimers();

    // Si ya hay un toast visible, lo ocultamos brevemente antes de mostrar el nuevo
    if (this.visible) {
      this.visible = false;
      this.cdr.markForCheck();
      this.animationTimer = setTimeout(() => this.displayToast(toast), 150);
    } else {
      this.displayToast(toast);
    }
  }

  private displayToast(toast: ToastMessage): void {
    this.currentToast = toast;
    this.visible = false;
    this.cdr.markForCheck();

    // Pequeño delay para que la transición CSS sea visible
    this.animationTimer = setTimeout(() => {
      this.visible = true;
      this.cdr.markForCheck();
    }, 10);

    const duration = toast.duration ?? 3000;
    if (duration > 0) {
      this.hideTimer = setTimeout(() => this.hide(), duration);
    }
  }

  private hide(): void {
    this.visible = false;
    this.cdr.markForCheck();

    this.animationTimer = setTimeout(() => {
      this.currentToast = null;
      this.cdr.markForCheck();
    }, 300); // Espera a que termine la animación de salida
  }

  private clearTimers(): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
      this.animationTimer = null;
    }
  }
}