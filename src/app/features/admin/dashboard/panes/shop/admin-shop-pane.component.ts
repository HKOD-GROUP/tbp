import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Storage } from '@angular/fire/storage';
import type { Product, ProductSize } from '../../../../../core/models/product.model';
import {
  AdminProductsService,
  type ProductDraft,
} from '../../../../../core/services/admin/admin-products.service';
import { resizeAndConvertToWebp, uploadImage } from '../../../../../core/util/image-upload';
import { TbpAlertComponent } from '../../../../../shared/ui/tbp-alert/tbp-alert.component';
import { TbpBadgeComponent } from '../../../../../shared/ui/tbp-badge/tbp-badge.component';
import { TbpButtonComponent } from '../../../../../shared/ui/tbp-button/tbp-button.component';
import { TbpConfirmDialogComponent } from '../../../../../shared/ui/tbp-confirm-dialog/tbp-confirm-dialog.component';
import {
  TbpDropzoneComponent,
  type TbpDropzonePreview,
} from '../../../../../shared/ui/tbp-dropzone/tbp-dropzone.component';
import { TbpFieldComponent } from '../../../../../shared/ui/tbp-field/tbp-field.component';
import { TbpIconButtonComponent } from '../../../../../shared/ui/tbp-icon-button/tbp-icon-button.component';
import { TbpSelectComponent } from '../../../../../shared/ui/tbp-select/tbp-select.component';
import { TbpSwitchComponent } from '../../../../../shared/ui/tbp-switch/tbp-switch.component';
import { TbpTextareaComponent } from '../../../../../shared/ui/tbp-textarea/tbp-textarea.component';
import { TbpToastService } from '../../../../../shared/ui/tbp-toast/tbp-toast.service';

const MAX_PHOTOS = 4;
const STOCK_OPTIONS = [
  { value: 'true', label: 'Disponible' },
  { value: 'false', label: 'Épuisé' },
];
const PAYPAL_PREFIX = 'https://www.paypal.com/ncp/payment/';

@Component({
  selector: 'tbp-admin-shop-pane',
  standalone: true,
  imports: [
    FormsModule,
    TbpAlertComponent,
    TbpBadgeComponent,
    TbpButtonComponent,
    TbpConfirmDialogComponent,
    TbpDropzoneComponent,
    TbpFieldComponent,
    TbpIconButtonComponent,
    TbpSelectComponent,
    TbpSwitchComponent,
    TbpTextareaComponent,
  ],
  templateUrl: './admin-shop-pane.component.html',
})
export class AdminShopPaneComponent {
  protected readonly productsService = inject(AdminProductsService);
  private readonly storage = inject(Storage);
  private readonly toast = inject(TbpToastService);

  protected readonly stockOptions = STOCK_OPTIONS;

  protected readonly hasVisibleProducts = computed(() =>
    this.productsService.all().some((p) => p.visible),
  );

  protected readonly sheetOpen = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly saving = signal(false);

  protected readonly nameCtrl = signal('');
  protected readonly priceCtrl = signal('');
  protected readonly descriptionCtrl = signal('');
  protected readonly colorsCtrl = signal('');
  protected readonly orderCtrl = signal(1);
  protected readonly visibleCtrl = signal(true);
  protected readonly images = signal<string[]>([]);
  protected readonly imagesUploading = signal(false);
  protected readonly sizes = signal<ProductSize[]>([]);
  protected readonly singlePaypalUrl = signal('');

  protected readonly imagePreviews = computed<TbpDropzonePreview[]>(() =>
    this.images().map((url, i) => ({ url, name: `Photo ${i + 1}` })),
  );

  protected readonly deleteTarget = signal<{ id: string; name: string } | null>(null);

  openCreate(): void {
    this.editingId.set(null);
    this.nameCtrl.set('');
    this.priceCtrl.set('');
    this.descriptionCtrl.set('');
    this.colorsCtrl.set('');
    this.orderCtrl.set(this.productsService.all().length + 1);
    this.visibleCtrl.set(true);
    this.images.set([]);
    this.sizes.set([]);
    this.singlePaypalUrl.set('');
    this.sheetOpen.set(true);
  }

  protected openEdit(product: Product): void {
    this.editingId.set(product.id);
    this.nameCtrl.set(product.name);
    this.priceCtrl.set(String(product.price));
    this.descriptionCtrl.set(product.description ?? '');
    this.colorsCtrl.set((product.colors ?? []).join(', '));
    this.orderCtrl.set(product.order);
    this.visibleCtrl.set(product.visible);
    this.images.set([...product.images]);
    this.sizes.set(product.sizes ? product.sizes.map((s) => ({ ...s })) : []);
    this.singlePaypalUrl.set(product.paypalUrl ?? '');
    this.sheetOpen.set(true);
  }

  protected closeSheet(): void {
    this.sheetOpen.set(false);
  }

  protected async onImagesAdded(files: FileList): Promise<void> {
    const remaining = MAX_PHOTOS - this.images().length;
    if (remaining <= 0) {
      this.toast.show(`${MAX_PHOTOS} photos maximum.`);
      return;
    }
    this.imagesUploading.set(true);
    try {
      for (const file of Array.from(files).slice(0, remaining)) {
        const blob = await resizeAndConvertToWebp(file);
        const path = `products/${Date.now()}-${crypto.randomUUID()}.webp`;
        const url = await uploadImage(this.storage, path, blob);
        this.images.update((list) => [...list, url]);
      }
    } catch (error) {
      this.toast.show(error instanceof Error ? error.message : "Échec de l'envoi d'une image.");
    } finally {
      this.imagesUploading.set(false);
    }
  }

  protected removeImage(index: number): void {
    this.images.update((list) => list.filter((_, i) => i !== index));
  }

  protected addSize(): void {
    this.sizes.update((rows) => [...rows, { label: '', paypalUrl: '', available: true }]);
  }

  protected removeSize(index: number): void {
    this.sizes.update((rows) => rows.filter((_, i) => i !== index));
  }

  protected updateSizeLabel(index: number, label: string): void {
    this.sizes.update((rows) => rows.map((row, i) => (i === index ? { ...row, label } : row)));
  }

  protected updateSizeUrl(index: number, paypalUrl: string): void {
    this.sizes.update((rows) => rows.map((row, i) => (i === index ? { ...row, paypalUrl } : row)));
  }

  protected updateSizeStock(index: number, available: string): void {
    this.sizes.update((rows) =>
      rows.map((row, i) => (i === index ? { ...row, available: available === 'true' } : row)),
    );
  }

  protected isSizeUrlInvalid(url: string): boolean {
    return !!url && !url.startsWith(PAYPAL_PREFIX);
  }

  protected sizeLabels(product: Product): string {
    return (product.sizes ?? []).map((s) => s.label).join(', ');
  }

  protected async save(): Promise<void> {
    const price = Number(this.priceCtrl().replace(',', '.'));
    if (!this.nameCtrl().trim() || !Number.isFinite(price) || price <= 0) {
      this.toast.show('Nom et prix sont obligatoires.');
      return;
    }
    if (!this.images().length) {
      this.toast.show('Au moins une photo est obligatoire.');
      return;
    }
    if (this.sizes().length) {
      const invalid = this.sizes().some(
        (s) => !s.label.trim() || this.isSizeUrlInvalid(s.paypalUrl) || !s.paypalUrl,
      );
      if (invalid) {
        this.toast.show('Chaque taille doit avoir un libellé et un lien PayPal valide.');
        return;
      }
    } else if (this.singlePaypalUrl() && this.isSizeUrlInvalid(this.singlePaypalUrl())) {
      this.toast.show('Le lien PayPal doit commencer par ' + PAYPAL_PREFIX);
      return;
    }

    this.saving.set(true);
    const colors = this.colorsCtrl()
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const draft: ProductDraft = {
      name: this.nameCtrl().trim(),
      slug: this.productsService.uniqueSlug(this.nameCtrl().trim(), this.editingId() ?? undefined),
      price,
      description: this.descriptionCtrl().trim() || undefined,
      images: this.images(),
      colors: colors.length ? colors : undefined,
      sizes: this.sizes().length ? this.sizes() : undefined,
      paypalUrl: !this.sizes().length ? this.singlePaypalUrl().trim() || undefined : undefined,
      order: this.orderCtrl(),
      visible: this.visibleCtrl(),
    };

    try {
      const id = this.editingId();
      if (id) {
        await this.productsService.update(id, draft);
      } else {
        await this.productsService.create(draft);
      }
      this.toast.show('Modifications enregistrées.');
      this.sheetOpen.set(false);
    } catch {
      this.toast.show("Échec de l'enregistrement.");
    } finally {
      this.saving.set(false);
    }
  }

  protected askDelete(product: Product): void {
    this.deleteTarget.set({ id: product.id, name: product.name });
  }

  protected async confirmDelete(): Promise<void> {
    const target = this.deleteTarget();
    if (!target) return;
    await this.productsService.delete(target.id);
    this.deleteTarget.set(null);
    this.toast.show('Article supprimé.');
  }
}
