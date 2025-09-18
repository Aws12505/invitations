export interface InvitationLink {
    id: number;
    token: string;
    first_name: string;
    father_name: string;
    last_name: string;
    full_name: string;
    limit: number;
    usage: number;
    default_vip_status: 'regular' | 'vip' | 'premium';
    is_active: boolean;
    created_at: string;
    updated_at: string;
    attendants?: Attendant[];
}

export interface Attendant {
    id: number;
    first_name: string;
    father_name: string;
    last_name: string;
    full_name: string;
    phone_number: string;
    qr_token: string;
    qr_code_url: string;
    invitation_link_id: number;
    vip_status: 'regular' | 'vip' | 'premium';
    attended: boolean;
    attendance_status: 'coming' | 'maybe' | 'not_coming' | null;
    status_token: string;
    chair_number: number | null; // Add this
    chair_section: string; // Add this
    created_at: string;
    updated_at: string;
    invitation_link?: InvitationLink;
}

export type VipStatus = 'regular' | 'vip' | 'premium';
export type AttendanceStatus = 'coming' | 'maybe' | 'not_coming';

interface PaginationData {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
  prev_page_url: string | null;
  next_page_url: string | null;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

interface InvitationLinksData {
  data: InvitationLink[];
  pagination: PaginationData;
}

interface Statistics {
  total: number;
  active: number;
  totalAttendants: number;
  avgUsage: number;
}

interface Props {
  invitationLinks: InvitationLinksData;
  statistics: Statistics;
}

export interface ChairStatistics {
    total_chairs: number;
    total_occupied: number;
    total_available: number;
    vip_total: number;
    vip_occupied: number;
    vip_available: number;
    regular_total: number;
    regular_occupied: number;
    regular_available: number;
}