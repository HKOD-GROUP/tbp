import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../core/services/products.service';
import { TbpProductCardComponent } from '../../../shared/ui/tbp-product-card/tbp-product-card.component';
import { TbpSizePickerComponent } from '../../../shared/ui/tbp-size-picker/tbp-size-picker.component';

@Component({
  selector: 'tbp-page-shop',
  standalone: true,
  imports: [FormsModule, TbpProductCardComponent, TbpSizePickerComponent],
  templateUrl: './shop.page.component.html',
})
export class ShopPageComponent {
  protected readonly products = inject(ProductsService);

  // Taille sélectionnée par produit (slug -> label de la taille).
  private readonly selections = signal<Record<string, string>>({});

  protected selectSize(slug: string, label: string): void {
    this.selections.update((current) => ({ ...current, [slug]: label }));
  }

  protected buyHref(product: {
    slug: string;
    sizes?: { label: string; paypalUrl: string; available: boolean }[];
    paypalUrl?: string;
  }): string | undefined {
    if (!product.sizes?.length) return product.paypalUrl;
    const selectedLabel =
      this.selections()[product.slug] ?? product.sizes.find((s) => s.available)?.label;
    return product.sizes.find((s) => s.label === selectedLabel)?.paypalUrl;
  }
}
