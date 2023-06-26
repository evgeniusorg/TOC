export type Page = {
  url?: string;
  title: string;
  id: string;
  pages: Page[];
  tabIndex: number;
  level: number;
}
