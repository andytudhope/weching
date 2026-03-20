export interface InquiryFragment {
  text: string;
  author?: string;
  addedAt: number; // ms timestamp
}

export interface CircleParticipant {
  deviceId: string;
  name?: string;
  numbers: number[]; // 7 values: pile counts or timing digit sums
  submittedAt: number;
}

export interface Circle {
  id: string;
  createdAt: number;
  method: "seeds" | "timing";  // casting method chosen at creation
  parentIds: string[];         // circles this was seeded from (empty if root)
  inquiry?: string;            // distilled group inquiry question
  fragments: InquiryFragment[];
  participants: CircleParticipant[];
  // No status/result — hexagram computed client-side; circle is never locked
}
