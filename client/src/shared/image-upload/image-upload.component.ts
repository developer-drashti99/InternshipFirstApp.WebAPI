import { Component, input, signal, output } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
  protected imgSrc=signal< string | ArrayBuffer | null | undefined>(null);
  protected isDragging = false;
  protected fileToUpload: File | null = null;
  uploadFile = output<File>();
  loading = input<boolean>(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    debugger;
    this.isDragging = true;
  }
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    debugger;
    this.isDragging = false;
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    debugger;
    this.isDragging = false;

    if (event.dataTransfer?.files.length) {
      //to upload one file at a time
      const file = event.dataTransfer.files[0];
      this.previewImage(file);
      this.fileToUpload = file;
    }
  }
  onCancel()
  {
    this.fileToUpload=null;
    this.imgSrc.set(null);
  }
  onUploadFile()
  {
    if(this.fileToUpload)
    {
      this.uploadFile.emit(this.fileToUpload);
    }
  }
  private previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => this.imgSrc.set(e.target?.result);
    reader.readAsDataURL(file);
  }
}
