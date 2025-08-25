import { Course } from '../../shared/entities';

export interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  selectedCourse: Course | null;
}

export const initialState: CoursesState = {
  courses: [],
  loading: false,
  error: null,
  selectedCourse: null
};
