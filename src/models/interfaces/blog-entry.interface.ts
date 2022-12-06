export interface IBlog {
  uid: string;
  date: Date;
  title: string;
  approved: boolean;
  author: string;
  authorid: string;
  category: 'Tournament Report' | 'Deck-Review';
}

export interface IBlogWithText extends IBlog {
  text: any;
}
