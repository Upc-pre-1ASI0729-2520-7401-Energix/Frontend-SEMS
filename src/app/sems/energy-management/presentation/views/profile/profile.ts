import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../authentication/application/services/auth.service';
import { User } from '../../../../authentication/domain/model/entities/user.entity';
import { ProfileService } from '../../../application/services/profile.service';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profilePhotoUrl = '/assets/default-avatar.png';
  editable = false;
  isLoading = true;

  editableProfile: Partial<User> = {};

  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
    private readonly ngZone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    console.log('ProfileComponent - Iniciando carga de perfil...');

    // Obtener el usuario del AuthService
    this.user = this.authService.getCurrentUser();
    console.log('ProfileComponent - Usuario actual:', this.user);

    if (this.user) {
      // Cargar datos del perfil desde el backend
      this.loadProfileFromBackend();
    } else {
      console.log('ProfileComponent - No hay usuario autenticado');
      this.isLoading = false;
    }
  }

  private loadProfileFromBackend(): void {
    console.log('ProfileComponent - Cargando perfil desde backend...');

    this.profileService.loadUserProfile('me').subscribe({
      next: (profile) => {
        console.log('ProfileComponent - Perfil cargado:', profile);

        this.editableProfile = {
          id: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          address: profile.address,
          profilePhotoUrl: profile.profilePhotoUrl
        };

        console.log('ProfileComponent - editableProfile created:', this.editableProfile);

        setTimeout(() => {
          this.profilePhotoUrl = profile.profilePhotoUrl || '/assets/default-avatar.png';
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 50);
      },
      error: (error) => {
        console.error('ProfileComponent - Error cargando perfil:', error);
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 50);
      }
    });
  }


  onEdit(): void {
    this.editable = !this.editable;
  }

  saveChanges(): void {
    console.log('ProfileComponent - Guardando cambios:', this.editableProfile);

    if (this.user && this.editableProfile) {
      const profileResource = {
        id: this.editableProfile.id || '',
        email: this.editableProfile.email || '',
        firstName: this.editableProfile.firstName || '',
        lastName: this.editableProfile.lastName || '',
        phoneNumber: this.editableProfile.phoneNumber,
        address: this.editableProfile.address,
        profilePhotoUrl: this.editableProfile.profilePhotoUrl
      };

      this.profileService.updateProfile('me', profileResource).subscribe({
        next: (updatedProfile) => {
          console.log('ProfileComponent - Perfil actualizado:', updatedProfile);
          this.editable = false;
          this.loadProfileFromBackend();
        },
        error: (error) => {
          console.error('ProfileComponent - Error actualizando perfil:', error);
        }
      });
    }
  }


  changePhoto(): void {
    const photoUrl = prompt('Ingresa la URL de tu foto de perfil:', this.profilePhotoUrl);

    if (photoUrl && photoUrl.trim() !== '') {
      this.profilePhotoUrl = photoUrl.trim();
      this.editableProfile = {
        ...this.editableProfile,
        profilePhotoUrl: photoUrl.trim()
      };

      console.log('ProfileComponent - Nueva URL de foto:', photoUrl);

      // Automatically save photo change
      if (this.user && this.editableProfile) {
        const profileResource = {
          id: this.editableProfile.id || '',
          email: this.editableProfile.email || '',
          firstName: this.editableProfile.firstName || '',
          lastName: this.editableProfile.lastName || '',
          phoneNumber: this.editableProfile.phoneNumber,
          address: this.editableProfile.address,
          profilePhotoUrl: photoUrl.trim()
        };

        console.log('ProfileComponent - Guardando perfil con nueva foto:', profileResource);

        this.profileService.updateProfile('me', profileResource).subscribe({
          next: (updatedProfile) => {
            console.log('ProfileComponent - Foto de perfil actualizada:', updatedProfile);
            alert('Foto de perfil actualizada correctamente');
            this.loadProfileFromBackend();
          },
          error: (error) => {
            console.error('ProfileComponent - Error actualizando foto:', error);
            alert('Error al actualizar la foto de perfil');
          }
        });
      }
    }
  }
}
