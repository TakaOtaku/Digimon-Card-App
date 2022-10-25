export interface IBlog {
  uid: string;
  date: Date;
  title: string;
  approved: boolean;
  author: string;
  authorId: string;
  category: 'Tournament Report';
}

export interface IBlogWithText extends IBlog {
  text: any;
}
