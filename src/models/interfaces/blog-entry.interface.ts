export interface IBlog {
  uid: string;
  date: Date;
  title: string;
  description?: string;
  image?: string;
  approved: boolean;
  author: string;
  authorid: string;
  autherImage?: string;
  category: 'Tournament Report' | 'Archtype-Review';
}

export interface IBlogWithText extends IBlog {
  text: any;
}
