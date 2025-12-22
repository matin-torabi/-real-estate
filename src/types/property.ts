export type PropertyFormData = {
  type: string;
  title: string;
  address?: string | null;
  description?: string | null;
  phone?: string | null;
  price?: number | null;
  rent?: number | null;
  deposit?: number | null;
  images?: string[];
  meter?: number | null;
};

export type PropertyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyFormData) => void;
};