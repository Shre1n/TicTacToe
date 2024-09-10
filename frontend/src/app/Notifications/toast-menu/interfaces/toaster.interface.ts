import { ToastType } from '../toaster.types';


/**
 * Defines a Toast with explicit Values
 */
export interface Toast {
  type: ToastType;
  title: string;
  body: string;
  delay?: number;
  save?: boolean;
  read: boolean;
}
