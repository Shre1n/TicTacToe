import { ToastType } from '../toaster.types';

export interface Toast {
  type: ToastType;
  title: string;
  body: string;
  delay?: number;
}
