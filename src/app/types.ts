export interface ApiPage {
  url: string;
  title: string;
  id: string;
  pages?: string[];
  tabIndex: number;
  level: number;
  anchors?: string[];
}

export interface Page extends Omit<ApiPage, 'pages' | 'anchors'> {
  pages?: Page[];
  anchors?: ApiAnchor[];
  isActive?: boolean;
  isOpen?: boolean;
  pagesCount: number;
}

export interface ApiAnchor {
  anchor: string;
  title: string;
  id: string;
}

export interface Anchor extends ApiAnchor {}

export interface ApiResponse {
  entities: {
    pages?: Record<string, ApiPage>;
    anchors?: Record<string, ApiAnchor>;
  };
  topLevelIds: string[];
}