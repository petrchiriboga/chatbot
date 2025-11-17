export interface Pet {
  key: string;
  customerId: string;
  name: string;
  petType: 'dog' | 'reptile' | 'bird' | 'cat' | 'other';
  sex: string;
  photo?: string;
  primaryBreed?: string;
}
