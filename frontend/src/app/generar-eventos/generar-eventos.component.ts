import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  HttpClient,
  HttpHeaders,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generar-eventos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generar-eventos.component.html',
  styleUrl: './generar-eventos.component.css',
})
export class GenerarEventosComponent {
  /* ─── Cloudinary (unsigned preset) ─── */
  private readonly CLOUD_NAME = 'dcxvf6bhc';
  private readonly UPLOAD_PRESET = 'eventos_unsigned';   // asegúrate de crearlo así

  /* ─── inyecciones ─── */
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  /* ─── formulario ─── */
  form = this.fb.group({
    nombreEvento: ['', Validators.required],
    fechaEvento: ['', Validators.required],
    tipoEvento: ['', Validators.required],
    imagenUrl: ['', Validators.required],
  });

  /* ─── estado UI ─── */
  loading = false;   // al enviar al backend
  uploading = false;   // al subir a Cloudinary
  uploadProgress = 0;
  isDragOver = false;
  previewUrl = '';
  error = '';
  success = false;

  /* ---------- helpers ---------- */
  invalid(ctrl: string): boolean {
    const c = this.form.get(ctrl);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  /* ---------- drag & drop ---------- */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }
  onDragLeave(): void {
    this.isDragOver = false;
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files?.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
      input.value = '';
    }
  }

  /* ---------- subida a Cloudinary ---------- */
  private handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.error = 'El archivo debe ser una imagen';
      return;
    }

    // pre-visualización
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(file);

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', this.UPLOAD_PRESET);

    const url = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/upload`;

    this.uploading = true;
    this.uploadProgress = 0;
    this.error = '';

    this.http.post(url, data, { observe: 'events', reportProgress: true })
      .subscribe({
        next: (ev: HttpEvent<any>) => {
          if (ev.type === HttpEventType.UploadProgress && ev.total) {
            this.uploadProgress = Math.round(ev.loaded * 100 / ev.total);
          } else if (ev.type === HttpEventType.Response) {
            this.uploading = false;
            this.form.patchValue({ imagenUrl: ev.body.secure_url });
          }
        },
        error: () => {
          this.uploading = false;
          this.error = 'Error al subir la imagen';
        },
      });
  }
  /* ---------- envío al backend ---------- */
  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = false;

    // ⬇️  Petición sin cabeceras extra
    this.http.post('http://localhost:3000/api/eventos', this.form.value).subscribe({
      next: () => {
        this.success = true;
        this.form.reset();
        this.previewUrl = '';
        this.loading = false;
        this.router.navigate(['/eventos']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al crear evento';
        this.loading = false;
      },
    });
  }

}
