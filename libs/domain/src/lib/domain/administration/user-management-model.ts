export interface ManageUserProfileInput {
  username?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  profileImageUrl?: string;
  active?: boolean;
  locked?: boolean;
  expired?: boolean;
  credentialsExpired?: boolean;
  authorityIds?: string[];
  roleId?: string;
}
