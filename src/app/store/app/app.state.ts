import { User } from '../../shared/entities';

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  pageTitle: string;
  loading: boolean;
}

export const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  token: null,
  pageTitle: '',
  loading: false
};
