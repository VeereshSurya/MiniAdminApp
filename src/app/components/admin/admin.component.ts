import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Header, MessageService } from 'primeng/api';
import { Poem } from 'src/app/models/poem';
import { PoemService } from 'src/app/services/poem.service';

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [MessageService, ConfirmationService],
  encapsulation: ViewEncapsulation.None // Disable encapsulation styles conflicts
})
export class AdminComponent {

  poemForm: FormGroup = new FormGroup({});
  poems!: Poem[];

  exportColumns!: ExportColumn[];

  selectedPoems!: Poem[];

  loading: boolean = true;

  poemDialog: boolean = false;

  submitted: boolean = false;

  poem!: Poem;

  isEditMode: boolean = false;

  today: Date = new Date();

  columns: any[] = [
    { field: 'Actions', Header: 'Actions', width: '150px', sortable: false },
    { field: 'poemId', header: 'Poem Id', width: '100px', sortable: true },
    { field: 'title', header: 'Title', width: '200px', sortable: true },
    {
      field: 'coverImageUrl',
      header: 'Cover Image',
      width: '150px',
      sortable: false,
    },
    {
      field: 'readingTime',
      header: 'Time Required',
      width: '250px',
      sortable: false,
    },
  
    {
      field: 'categories',
      header: 'Categories',
      width: '300px',
      sortable: false,
    },
    { field: 'authorName', header: 'Author Name', with: '200px', sortable: false },
    {
      field: 'publishedAt',
      header: 'Published At',
      width: '150px',
      sortable: true,
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private poemService: PoemService
  ) {}

  ngOnInit(): void {
    this.loading = false;

    this.exportColumns = this.columns.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));

    this.getAllPoems();

    this.poemForm = this.formBuilder.group({
      poemId: [null],
      title: ['', Validators.required],
      readingTime: [5, Validators.required],
      categories: ['', Validators.required],
      authorName: ['', Validators.required],
      background: [''],
      lines: ['', Validators.required],
      summary: [''],
      coverImageUrl: ['', Validators.required],
      publishedAt: [new Date(), Validators.required],
    });
  }

  getAllPoems(): void {
    this.poemService.getAllPoems().subscribe({
      next: (response) => {
        this.poems = response.data;
      },
      error: (err) => {
        console.error('Error in fetching the poems', err);
      },
    });
  }

  openNew() {
    this.poem = {poemId : 0};
    this.submitted = false;
    this.poemDialog = true;
  }

  hideDialog() {
    this.poemDialog = false;
    this.submitted = false;
  }

  // Edit poem: populate form with the selected poem's data
  editPoem(poem: Poem) {
    this.poemDialog = true;
    this.isEditMode = true;
    const poemWithDate = {
      ...poem,
      publishedAt: poem.publishedAt ? new Date(poem.publishedAt) : null,
    };

    this.poemForm.patchValue(poemWithDate); // Fill form with poem data for editing
  }

  // Handle form submission (create or update)
  savePoem() {
    if (this.poemForm.valid) {
      let newPoem = this.poemForm.value;
      var result;
      if (this.isEditMode) {
        this.poemService.updatePoem(newPoem.poemId, newPoem).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Product Updated',
              life: 3000,
            });

            console.log('Poem Updated successfully');
            this.isEditMode = false; // Exit edit mode
            this.poemDialog = false;
            this.poemForm.reset(); // Reset the form
            this.getAllPoems(); // Refresh the list
          },

          error: (err) => {
            console.error('Error in updating the poem', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Failure',
              detail: 'Poem update operation failed',
              life: 3000, // Duration of the toast in milliseconds
            });
          },
        });
      } else {
        this.poemService.createNewPoem(newPoem).subscribe({
          next: () => {
            console.log('Poem created successfully');

            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Poem created successfully',
              life: 3000,
            });

            this.poemDialog = false;
            this.poemForm.reset(); // Reset the form
            this.getAllPoems(); // Refresh the list
          },
          error: (err) => {
            console.error('Error creating poem:', err);

            this.messageService.add({
              severity: 'error',
              summary: 'Failure',
              detail: 'Error occured while creating poem',
              life: 3000, // Duration of the toast in milliseconds
            });
          },
        });
      }
      this.poem = {poemId: 0};
    }
  }

  // Delete a poem
  deletePoem(poem: Poem) {
    this.confirmationService.confirm({
      message: 'Are you sure, you want to delete ' + poem.title + ' ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.poemService.deletePoem(poem.poemId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Poem Deleted successfully',
              life: 3000,
            });
            this.poem = {poemId: 0};
            console.log('Poem deleted successfully');
            this.getAllPoems(); // Refresh the list after deletion
          },

          error: (err) => {
            console.error('Error deleting poem:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Failure',
              detail: 'Error deleting poem',
              life: 3000, // Duration of the toast in milliseconds
            });
          },
        });
      },
    });
  }

  // back end API will not implemented yet.
  deleteSelectedPoems() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected employees',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successfull',
          detail: 'Poem deleted',
          life: 3000,
        });
      },
    });
  }

}
