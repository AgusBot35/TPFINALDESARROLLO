import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { ToastComponent } from "../../shared/toast/toast";
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, ToastComponent, RouterOutlet],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private toast = inject(ToastService)

  product = signal<Product | null>(null);

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    try {
      const p = await firstValueFrom(this.productsService.findOne(id));
      this.product.set(p);
    } catch {
      this.toast.error('Producto no encontrado');
    }
  }
}
