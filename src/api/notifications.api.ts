export interface Message {
  id: number;
  description: string;
  moderationData?: {
    id: number;
    pubkey: string;
    event_id: string;
    reason: string;
    created_at: string;
    is_read: boolean;
    content_type: string;
    media_url?: string;
    thumbnail_url?: string;
  };
}

export interface Mention extends Message {
  userName: string;
  userIcon: string;
  place: string;
  href: string;
}

export type Notification = Mention | Message;

// Export an empty array now that we're using real moderation notifications
export const notifications: Notification[] = [];
