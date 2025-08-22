import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User, ConfirmDialogData } from '../../../shared/entities';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class UsersPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  users: User[] = [];
  displayedColumns: string[] = ['name', 'username', 'email', 'role', 'actions'];
  loading = false;
  isAdmin = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar usuarios:', error);
          this.loading = false;
          this.snackBar.open('Error al cargar usuarios', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  addUser(): void {
    // Por ahora mostrar un mensaje, implementar formulario después
    this.snackBar.open('Funcionalidad de agregar usuario en desarrollo', 'Cerrar', {
      duration: 2000
    });
  }

  editUser(user: User): void {
    // Por ahora mostrar un mensaje, implementar formulario después
    this.snackBar.open(`Editando usuario: ${user.name}`, 'Cerrar', {
      duration: 2000
    });
  }

  viewUser(user: User): void {
    // Implementar vista de detalle si es necesario
    this.snackBar.open(`Viendo detalles de ${user.name}`, 'Cerrar', {
      duration: 2000
    });
  }

  deleteUser(user: User): void {
    if (user.id === this.authService.getCurrentUser()?.id) {
      this.snackBar.open('No puedes eliminar tu propia cuenta', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '400px',
      data: {
        title: 'Eliminar Usuario',
        message: `¿Estás seguro de que quieres eliminar al usuario "${user.name}"?`,
        type: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.snackBar.open('Usuario eliminado exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            this.snackBar.open('Error al eliminar usuario', 'Cerrar', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  getRoleDisplayName(role: string): string {
    return role === 'admin' ? 'Administrador' : 'Usuario';
  }

  getRoleColor(role: string): string {
    return role === 'admin' ? 'accent' : 'primary';
  }

  canEdit(user: User): boolean {
    return this.isAdmin && user.id !== this.authService.getCurrentUser()?.id;
  }

  canDelete(user: User): boolean {
    return this.isAdmin && user.id !== this.authService.getCurrentUser()?.id;
  }
}

// Componente de diálogo de confirmación
@Component({
  selector: 'confirm-delete-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">
        Eliminar
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class ConfirmDeleteDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}
} 