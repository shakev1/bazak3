
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
}

export type ComponentType = 'vehicle_readiness' | 'readiness_development' | 'free_text';

export interface DashboardComponent {
  id: string;
  type: ComponentType;
  title: string;
  unit: string;
  filters: string[];
  thresholds?: { red: number; orange: number };
  content?: string;
  config?: {
    isBold?: boolean;
    textColor?: string;
    fontSize?: 'sm' | 'md' | 'lg';
    textAlign?: 'right' | 'center' | 'left';
  };
}

export interface Screen {
  id: string;
  name: string;
  category: string;
  color: string;
  components: DashboardComponent[];
  isPublic: boolean;
  allowPublicEdit: boolean;
  ownerName?: string;
  ownerId?: string;
}

export interface MetricData {
  label: string;
  value: number | string;
  subLabel?: string;
  details?: { name: string; value: number | string }[];
  color?: string;
}

export interface ProgressMetric {
  label: string;
  percentage: number;
  countLabel: string;
  color: string;
}
