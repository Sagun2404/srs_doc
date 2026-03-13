export interface SRSSection {
  id: string;
  title: string;
  content: string;
  level: number;
  type?: 'text' | 'table' | 'list';
  children?: SRSSection[];
}






export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
