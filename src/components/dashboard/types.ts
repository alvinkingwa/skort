// ── Types ─────────────────────────────────────

export interface DashboardStats {
  totalBookings: number;
  totalEarnings: number;
  positiveRatings: number;
  totalStreams: number;
  earningsThisMonth: number;
  percentageIncreaseInEarnings: number;
  totalBookingsThisMonth: number;
  percentageIncreaseInBookings: number;
}

export interface Schedule {
  id: number;
  scheduleTime: string;
  scheduledLocation: string;
  amount: number;
  notes: string;
  testKitRequired: boolean;
  paid: boolean;
  services: { id: number; serviceName: string; serviceDescription: string }[];
  client: { email: string; firstName: string; lastName: string };
}

export interface ScheduleForm {
  clientEmail: string;
  scheduledDateTime: string;
  scheduledLocation: string;
  amount: string;
  notes: string;
  testKitRequired: boolean;
  serviceIds: number[];
}

export const AVAILABLE_SERVICES = [
  { id: 1, name: "Text Chat" },
  { id: 2, name: "Voice Call" },
  { id: 3, name: "Video Call" },
  { id: 4, name: "Orders" },
] as const;

export type SessionType = "call" | "video" | "order" | "chat";
export type VoteType    = "up" | "down";
export type TabId       = "overview" | "ratings" | "inbox" | "money" | "profile";

export interface Rating {
  id: number;
  client: string;
  type: SessionType;
  vote: VoteType;
  time: string;
}

export interface InboxItem {
  id: number;
  client: string;
  lastMsg: string;
  time: string;
  unread: number;
  type: SessionType;
}

export interface Transaction {
  id: number;
  label: string;
  amount: number;
  points: number;
  time: string;
  type: "session" | "tip";
}

export interface ModelFile {
  id: number;
  fileName: string;
  storeFileName: string;
  contentType: string;
  size: string;
}

export interface GalleryItem {
  preview: string;
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  fileId?: number;
}

// ── Mock data ─────────────────────────────────

export const MOCK_RATINGS: Rating[] = [
  { id: 1, client: "Client #4821", type: "call",  vote: "up",   time: "Today, 2:14 PM"      },
  { id: 2, client: "Client #3302", type: "chat",  vote: "up",   time: "Today, 11:30 AM"     },
  { id: 3, client: "Client #9871", type: "video", vote: "down", time: "Yesterday, 8:45 PM"  },
  { id: 4, client: "Client #1145", type: "order", vote: "up",   time: "Yesterday, 3:20 PM"  },
  { id: 5, client: "Client #5530", type: "chat",  vote: "up",   time: "Mon, 6:00 PM"        },
  { id: 6, client: "Client #2278", type: "call",  vote: "up",   time: "Mon, 1:15 PM"        },
  { id: 7, client: "Client #6643", type: "chat",  vote: "down", time: "Sun, 9:30 AM"        },
  { id: 8, client: "Client #8812", type: "video", vote: "up",   time: "Sat, 4:50 PM"        },
];

export const MOCK_INBOX: InboxItem[] = [
  { id: 1, client: "Client #4821", lastMsg: "Thank you, that was really helpful!", time: "2:14 PM",   unread: 0, type: "call"  },
  { id: 2, client: "Client #3302", lastMsg: "Can we continue tomorrow?",           time: "11:30 AM",  unread: 2, type: "chat"  },
  { id: 3, client: "Client #7761", lastMsg: "How much for a custom order?",        time: "Yesterday", unread: 1, type: "order" },
  { id: 4, client: "Client #1145", lastMsg: "Loved the session 🔥",               time: "Mon",       unread: 0, type: "video" },
  { id: 5, client: "Client #5530", lastMsg: "Are you available tonight?",          time: "Mon",       unread: 3, type: "chat"  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1, label: "Voice Call — Client #4821",   amount: 500,  points: 50,  time: "Today, 2:14 PM",     type: "session" },
  { id: 2, label: "Chat Session — Client #3302", amount: 200,  points: 20,  time: "Today, 11:30 AM",    type: "session" },
  { id: 3, label: "Tip from Client #9871",       amount: 300,  points: 0,   time: "Yesterday, 9:00 PM", type: "tip"     },
  { id: 4, label: "Custom Order — Client #1145", amount: 1500, points: 150, time: "Yesterday, 3:20 PM", type: "session" },
  { id: 5, label: "Video Call — Client #5530",   amount: 800,  points: 80,  time: "Mon, 6:00 PM",       type: "session" },
];