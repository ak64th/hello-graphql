export interface User {
  id: string | number;
  username: string;
}

export interface Message {
  id: string | number;
  text: string;
  userId: string | number;
}
