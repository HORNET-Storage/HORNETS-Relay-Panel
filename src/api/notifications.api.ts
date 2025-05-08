export interface Message {
  id: number;
  description: string;
}

export interface Mention extends Message {
  userName: string;
  userIcon: string;
  place: string;
  href: string;
}

export type Notification = Mention | Message;

// Export an empty array for notifications
export const notifications: Notification[] = [];
