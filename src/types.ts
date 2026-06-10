export interface Die {
  id: string;
  diameter: string;
  station: string;
  position: string;
  status: "Ready" | "In Use" | "Repair" | "Scrapped";
  quantity: number;
  notes?: string;
  lastUsed?: string;
  receivedDate?: string;
}

export interface DieHistory {
  id: string;
  dieId: string;
  date: any;
  action: string;
  notes: string;
  user: string;
  paperworkUrl?: string | null;
}
