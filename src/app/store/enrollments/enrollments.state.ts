import { Enrollment, EnrollmentWithDetails } from '../../shared/entities';

export interface EnrollmentsState {
  enrollments: Enrollment[];
  enrollmentsWithDetails: EnrollmentWithDetails[];
  loading: boolean;
  error: string | null;
}

export const initialState: EnrollmentsState = {
  enrollments: [],
  enrollmentsWithDetails: [],
  loading: false,
  error: null
};
