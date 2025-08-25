import { Student } from '../../shared/entities';

export interface StudentsState {
  students: Student[];
  loading: boolean;
  error: string | null;
  selectedStudent: Student | null;
}

export const initialState: StudentsState = {
  students: [],
  loading: false,
  error: null,
  selectedStudent: null
};
