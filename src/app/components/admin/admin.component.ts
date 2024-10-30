import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Poem } from 'src/app/models/poem';
import { PoemService } from 'src/app/services/poem.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [MessageService, ConfirmationService],
  encapsulation: ViewEncapsulation.None // Disable encapsulation to prevent style conflicts
})
export class AdminComponent {
  poemForm: FormGroup = new FormGroup({}); // Form for creating/editing poems
  poems!: Poem[]; // List of poems
  loading: boolean = true; // Loading state for data fetching
  poemDialog: boolean = false; // Control dialog visibility
  submitted: boolean = false; // Track form submission status
  poem!: Poem; // Current poem being edited or created
  isEditMode: boolean = false; // Track if in edit mode

  today: Date = new Date(); // Current date

  // Columns configuration for the poem table
  columns: any[] = [
    { field: 'Actions', header: 'Actions', width: '150px', sortable: false },
    { field: 'poemId', header: 'Id', width: '100px', sortable: true },
    { field: 'title', header: 'Title', width: '200px', sortable: true },
    { field: 'readingTime', header: 'Time', sortable: false },
    { field: 'categories', header: 'Categories', width: '200px', sortable: false },
    { field: 'authorName', header: 'Author', width: '200px', sortable: false },
    { field: 'publishedAt', header: 'Published Date', width: '150px', sortable: true },
    { field: 'coverImageUrl', header: 'Image', width: '150px', sortable: false },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private poemService: PoemService
  ) {}

  ngOnInit(): void {
    this.loading = false; // Set loading to false
    this.getAllPoems(); // Fetch all poems on initialization

    // Initialize the poem form with validation
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

  // Fetch all poems from the service
  getAllPoems(): void {
    this.poemService.getAllPoems().subscribe({
      next: (response) => {
        this.poems = response; // Assign fetched poems to the local variable
      },
      error: (err) => {
        console.error('Error in fetching the poems', err);
      },
    });
  }

  // Open dialog for adding a new poem
  openNew() {
    this.poem = { poemId: 0 }; // Reset poem object
    this.submitted = false; // Reset submitted status
    this.poemDialog = true; // Show the dialog
  }

  // Hide the poem dialog
  hideDialog() {
    this.poemDialog = false; // Close the dialog
    this.submitted = false; // Reset submitted status
    this.poem = { poemId: 0 }; // Reset poem object
  }

  // Edit a selected poem and populate the form
  editPoem(poem: Poem) {
    this.poemDialog = true; // Show the dialog
    this.isEditMode = true; // Set to edit mode
    const poemWithDate = {
      ...poem,
      publishedAt: poem.publishedAt ? new Date(poem.publishedAt) : null,
    };

    this.poemForm.patchValue(poemWithDate); // Fill form with poem data for editing
  }

  // Handle form submission (create or update)
  savePoem() {
    if (this.poemForm.valid) {
      let newPoem = this.poemForm.value; // Get form values
      if (this.isEditMode) {
        // Update existing poem
        this.poemService.updatePoem(newPoem.poemId, newPoem).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Poem Updated',
              life: 3000,
            });

            console.log('Poem Updated successfully');
            this.isEditMode = false; // Exit edit mode
            this.poemDialog = false; // Close dialog
            this.poemForm.reset(); // Reset the form
            this.getAllPoems(); // Refresh the list
          },
          error: (err) => {
            console.error('Error in updating the poem', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Failure',
              detail: 'Poem update operation failed',
              life: 3000,
            });
          },
        });
      } else {
        // Create new poem
        this.poemService.createNewPoem(newPoem).subscribe({
          next: () => {
            console.log('Poem created successfully');

            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Poem created successfully',
              life: 3000,
            });

            this.poemDialog = false; // Close dialog
            this.poemForm.reset(); // Reset the form
            this.getAllPoems(); // Refresh the list
          },
          error: (err) => {
            console.error('Error creating poem:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Failure',
              detail: 'Error occurred while creating poem',
              life: 3000,
            });
          },
        });
      }
      this.poem = { poemId: 0 }; // Reset poem object
    }
  }

  // Delete a selected poem
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
            this.poem = { poemId: 0 }; // Reset poem object
            console.log('Poem deleted successfully');
            this.getAllPoems(); // Refresh the list after deletion
          },
          error: (err) => {
            console.error('Error deleting poem:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Failure',
              detail: 'Error deleting poem',
              life: 3000,
            });
          },
        });
      },
    });
  }
}
