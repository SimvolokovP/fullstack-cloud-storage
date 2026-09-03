export interface ITariffPlan {
  id: string;
  name: string;
  description: string | null;
  maxSpace: number;
  maxFileSize: number;
  price: string | number;
  isActive: boolean;
}
