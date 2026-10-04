import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { TbpIconComponent } from '../tbp-icon/tbp-icon.component';

export interface TbpDropzonePreview {
  url: string;
  name: string;
}

@Component({
  selector: 'tbp-dropzone',
  standalone: true,
  imports: [TbpIconComponent],
  templateUrl: './tbp-dropzone.component.html',
})
export class TbpDropzoneComponent {
  readonly previews = input<TbpDropzonePreview[]>([]);
  readonly multiple = input(false);
  readonly accept = input('image/*');

  readonly filesAdded = output<FileList>();
  readonly removed = output<number>();

  protected readonly isOver = signal(false);

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected browse(): void {
    this.fileInput().nativeElement.click();
  }

  protected handleInputChange(files: FileList | null): void {
    if (files?.length) this.filesAdded.emit(files);
  }

  protected handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.isOver.set(false);
    const files = event.dataTransfer?.files;
    if (files?.length) this.filesAdded.emit(files);
  }
}
