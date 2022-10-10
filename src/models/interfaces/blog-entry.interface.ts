export interface IBlog {
  uid: string;
  date: Date;
  title: string;
  text: any;
  approved: boolean;
  author: string;
  category: 'Tournament Report';
}
