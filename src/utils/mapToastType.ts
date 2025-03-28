type ToastVariant = "default" | "destructive" | null | undefined;

export function mapToastType(type: 'success' | 'error' | 'info'): ToastVariant {
  switch (type) {
    case 'success':
      return 'default';
    case 'error':
      return 'destructive';
    default:
      return null;
  }
}