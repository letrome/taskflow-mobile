type Status = "ACTIVE" | "ARCHIVED";

export type Project = {
  id: string;
  title: string;
  description: string;
  status: Status;
  start_date?: string | null;
  end_date?: string | null;
  members?: string[];
  tags?: string[];
  created_by?: string;
};
