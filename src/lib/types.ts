// User Roles
export type UserRole = 'nurse' | 'agency_admin' | 'agency_staff' | 'platform_admin';

// Profile Status
export type ProfileStatus = 'pending_verification' | 'pending_review' | 'active' | 'suspended' | 'deactivated';

// Organisation Types
export type OrganisationType = 'nhs_trust' | 'private_hospital' | 'clinic' | 'care_home' | 'other';
export type OrganisationStatus = 'pending_verification' | 'pending_review' | 'active' | 'suspended' | 'deactivated';

// Shift Specialty
export type ShiftSpecialty =
  | 'critical_care'
  | 'accident_emergency'
  | 'general_medical'
  | 'general_surgical'
  | 'theatre'
  | 'cardiology'
  | 'oncology'
  | 'paediatrics'
  | 'neonatal'
  | 'maternity'
  | 'mental_health'
  | 'community'
  | 'elderly_care'
  | 'renal'
  | 'orthopaedics'
  | 'neurology'
  | 'respiratory'
  | 'endoscopy'
  | 'radiology'
  | 'rehabilitation';

// Nursing Band
export type NursingBand = 'band_5' | 'band_6' | 'band_7' | 'band_8a' | 'enrolled_nurse' | 'healthcare_assistant';

// Credential Types
export type CredentialType =
  | 'nmc_registration'
  | 'dbs_certificate'
  | 'right_to_work'
  | 'mandatory_training'
  | 'professional_indemnity'
  | 'hepatitis_b'
  | 'other';

// Credential Status
export type CredentialStatus = 'pending' | 'verified' | 'rejected' | 'expired';

// Shift Status
export type ShiftStatus = 'draft' | 'open' | 'filled' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';

// Application Status
export type ApplicationStatus = 'pending' | 'shortlisted' | 'selected' | 'rejected' | 'withdrawn';

// Support Ticket Category
export type SupportTicketCategory = 'credential_issue' | 'payment_issue' | 'account_access' | 'shift_dispute' | 'technical_bug' | 'compliance_query' | 'data_request' | 'other';

// Support Ticket Status
export type SupportTicketStatus = 'open' | 'in_progress' | 'pending_user' | 'resolved' | 'closed';

// Priority Levels
export type Priority = 'p1' | 'p2' | 'p3' | 'p4';

// Incident Severity
export type IncidentSeverity = 'p1' | 'p2' | 'p3' | 'p4';

// Incident Status
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';

// Availability Shift Types
export type ShiftTypePreference = 'days' | 'nights' | 'long_days';

// Day of Week
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Notification Channel
export type NotificationChannel = 'email' | 'in_app' | 'push';

// Notification Status
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'suppressed';

// Organisation Role
export type OrganisationRole = 'admin' | 'member';

// Database Interfaces

export interface NurslyProfile {
  id: string;
  role: UserRole;
  status: ProfileStatus;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface NurslyNurseProfile {
  id: string;
  nmc_pin?: string;
  phone_number?: string;
  location_city?: string;
  location_postcode?: string;
  specialties: string[];
  years_experience?: number;
  preferred_radius_km: number;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface NurslyOrganisation {
  id: string;
  name: string;
  type: OrganisationType;
  status: OrganisationStatus;
  billing_email?: string;
  created_at: string;
  updated_at: string;
}

export interface NurslyOrgMember {
  id: string;
  org_id: string;
  user_id: string;
  org_role: OrganisationRole;
  created_at: string;
}

export interface NurslyOrgLocation {
  id: string;
  org_id: string;
  name: string;
  address?: string;
  city?: string;
  postcode?: string;
  created_at: string;
}

export interface NurslyShift {
  id: string;
  org_id: string;
  posted_by: string;
  location_id: string;
  title: string;
  specialty: ShiftSpecialty;
  band: NursingBand;
  min_experience_years?: number;
  start_time: string;
  end_time: string;
  break_minutes: number;
  rate_per_hour: number;
  rate_is_negotiable: boolean;
  required_credentials: CredentialType[];
  notes?: string;
  status: ShiftStatus;
  filled_by?: string;
  filled_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface NurslyShiftApplication {
  id: string;
  shift_id: string;
  nurse_id: string;
  status: ApplicationStatus;
  message?: string;
  applied_at: string;
  updated_at: string;
}

export interface NurslyCredential {
  id: string;
  nurse_id: string;
  type: CredentialType;
  document_key?: string;
  document_uploaded_at?: string;
  expiry_date?: string;
  reference_number?: string;
  status: CredentialStatus;
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface NurslyAvailability {
  id: string;
  nurse_id: string;
  day_of_week: DayOfWeek;
  shift_types: ShiftTypePreference[];
  updated_at: string;
}

export interface NurslyNotification {
  id: string;
  recipient_id: string;
  event_type: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  payload: Record<string, unknown>;
  error_message?: string;
  sent_at?: string;
  created_at: string;
}

export interface NurlySupportTicket {
  id: string;
  ticket_ref: string;
  raised_by: string;
  category: SupportTicketCategory;
  status: SupportTicketStatus;
  subject: string;
  description: string;
  priority: Priority;
  linked_shift?: string;
  resolution?: string;
  created_at: string;
  updated_at: string;
}

export interface NurslyIncident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  affected_components: string[];
  reported_by: string;
  resolved_at?: string;
  resolution_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface NurslyAuditEvent {
  id: string;
  actor_id?: string;
  actor_role?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface NurslyCredentialExpiryNotice {
  id: string;
  credential_id: string;
  days_before: number;
  sent_at?: string;
}

// UI Type Aliases (for convenience in components)

export interface UserProfile extends NurslyProfile {
  email?: string;
  avatar_url?: string;
}

export interface WorkerProfile extends UserProfile {
  nurse_profile?: NurslyNurseProfile;
  credentials?: NurslyCredential[];
}

export interface ProviderProfile extends UserProfile {
  organisation?: NurslyOrganisation;
  organisation_role?: OrganisationRole;
}

// Training Progress
export interface NurslyTrainingProgress {
  id: string;
  user_id: string;
  module_id: string;
  module_name: string;
  description?: string;
  duration_minutes: number;
  mandatory: boolean;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Saved Searches
export interface NurslySavedSearch {
  id: string;
  user_id: string;
  name: string;
  specialty?: string;
  location?: string;
  min_rate?: number;
  filters: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Notification Preferences
export interface NurslyNotificationPreferences {
  id: string;
  user_id: string;
  shift_alerts: boolean;
  booking_updates: boolean;
  payment_notifications: boolean;
  compliance_reminders: boolean;
  marketing: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  channel_in_app: boolean;
  channel_email: boolean;
  channel_sms: boolean;
  created_at: string;
  updated_at: string;
}

// Instant Pay Request Status
export type InstantPayStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Instant Pay Preferred Method
export type InstantPayMethod = 'bank_transfer' | 'mobile_money';

// Instant Pay Requests
export interface NurslyInstantPayRequest {
  id: string;
  user_id: string;
  shift_id: string;
  amount: number;
  fee: number;
  status: InstantPayStatus;
  requested_at: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

// Instant Pay Settings
export interface NurslyInstantPaySettings {
  id: string;
  user_id: string;
  enabled: boolean;
  preferred_method: InstantPayMethod;
  account_details: Record<string, unknown>;
  max_percentage: number;
  created_at: string;
  updated_at: string;
}

// Moderation Flags
export interface NurslyModerationFlag {
  id: string;
  flag_type: string;
  flagged_user?: string;
  issue: string;
  reason?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'reviewed' | 'resolved';
  action_taken?: string;
  reviewed_by?: string;
  flagged_at: string;
  reviewed_at?: string;
  created_at: string;
}

// Database Type Mapping
export type Database = {
  public: {
    Tables: {
      nursly_profiles: {
        Row: NurslyProfile;
        Insert: Omit<NurslyProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NurslyProfile, 'id' | 'created_at' | 'updated_at'>>;
      };
      nursly_nurse_profiles: {
        Row: NurslyNurseProfile;
        Insert: Omit<NurslyNurseProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NurslyNurseProfile, 'id' | 'created_at' | 'updated_at'>>;
      };
      nursly_organisations: {
        Row: NurslyOrganisation;
        Insert: Omit<NurslyOrganisation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NurslyOrganisation, 'id' | 'created_at' | 'updated_at'>>;
      };
      nursly_org_members: {
        Row: NurslyOrgMember;
        Insert: Omit<NurslyOrgMember, 'id' | 'created_at'>;
        Update: Partial<Omit<NurslyOrgMember, 'id' | 'created_at'>>;
      };
      nursly_org_locations: {
        Row: NurslyOrgLocation;
        Insert: Omit<NurslyOrgLocation, 'id' | 'created_at'>;
        Update: Partial<Omit<NurslyOrgLocation, 'id' | 'created_at'>>;
      };
      nursly_shifts: {
        Row: NurslyShift;
        Insert: Omit<NurslyShift, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NurslyShift, 'id' | 'created_at' | 'updated_at'>>;
      };
      nursly_shift_applications: {
        Row: NurslyShiftApplication;
        Insert: Omit<NurslyShiftApplication, 'id' | 'applied_at' | 'updated_at'>;
        Update: Partial<Omit<NurslyShiftApplication, 'id' | 'applied_at' | 'updated_at'>>;
      };
      nursly_credentials: {
        Row: NurslyCredential;
        Insert: Omit<NurslyCredential, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NurslyCredential, 'id' | 'created_at' | 'updated_at'>>;
      };
      nursly_availability: {
        Row: NurslyAvailability;
        Insert: Omit<NurslyAvailability, 'id' | 'updated_at'>;
        Update: Partial<Omit<NurslyAvailability, 'id' | 'updated_at'>>;
      };
      nursly_notifications: {
        Row: NurslyNotification;
        Insert: Omit<NurslyNotification, 'id' | 'created_at'>;
        Update: Partial<Omit<NurslyNotification, 'id' | 'created_at'>>;
      };
      nursly_support_tickets: {
        Row: NurlySupportTicket;
        Insert: Omit<NurlySupportTicket, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NurlySupportTicket, 'id' | 'created_at' | 'updated_at'>>;
      };
      nursly_incidents: {
        Row: NurslyIncident;
        Insert: Omit<NurslyIncident, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NurslyIncident, 'id' | 'created_at' | 'updated_at'>>;
      };
      nursly_audit_events: {
        Row: NurslyAuditEvent;
        Insert: Omit<NurslyAuditEvent, 'id' | 'created_at'>;
        Update: Partial<Omit<NurslyAuditEvent, 'id' | 'created_at'>>;
      };
      nursly_credential_expiry_notices: {
        Row: NurslyCredentialExpiryNotice;
        Insert: Omit<NurslyCredentialExpiryNotice, 'id'>;
        Update: Partial<Omit<NurslyCredentialExpiryNotice, 'id'>>;
      };
      nursly_training_progress: {
        Row: NurslyTrainingProgress;
        Insert: Omit<NurslyTrainingProgress, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NurslyTrainingProgress, 'id' | 'created_at' | 'updated_at'>>;
      };
      nursly_saved_searches: {
        Row: NurslySavedSearch;
        Insert: Omit<NurslySavedSearch, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NurslySavedSearch, 'id' | 'created_at' | 'updated_at'>>;
      };
      nursly_notification_preferences: {
        Row: NurslyNotificationPreferences;
        Insert: Omit<NurslyNotificationPreferences, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NurslyNotificationPreferences, 'id' | 'created_at' | 'updated_at'>>;
      };
      nursly_moderation_flags: {
        Row: NurslyModerationFlag;
        Insert: Omit<NurslyModerationFlag, 'id' | 'created_at'>;
        Update: Partial<Omit<NurslyModerationFlag, 'id' | 'created_at'>>;
      };
      nursly_instant_pay_requests: {
        Row: NurslyInstantPayRequest;
        Insert: Omit<NurslyInstantPayRequest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NurslyInstantPayRequest, 'id' | 'created_at' | 'updated_at'>>;
      };
      nursly_instant_pay_settings: {
        Row: NurslyInstantPaySettings;
        Insert: Omit<NurslyInstantPaySettings, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NurslyInstantPaySettings, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};
