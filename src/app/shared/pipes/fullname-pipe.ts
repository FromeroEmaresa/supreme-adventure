import { Pipe, PipeTransform } from '@angular/core';
import { Student } from '../entities';

@Pipe({
  name: 'fullname',
  standalone: true
})
export class FullnamePipe implements PipeTransform {

  transform(student: Student | null): string;
  transform(name: string, surname: string): string;
  transform(studentOrName: Student | string | null, surname?: string): string {
    if (!studentOrName) {
      return '';
    }
    
    if (typeof studentOrName === 'string' && surname) {
      // Uso tradicional: nombre y apellido separados
      return `${studentOrName} ${surname}`;
    } else if (typeof studentOrName === 'object' && studentOrName.firstName && studentOrName.lastName) {
      // Uso con objeto Student
      return `${studentOrName.firstName} ${studentOrName.lastName}`;
    }
    
    return '';
  }

} 