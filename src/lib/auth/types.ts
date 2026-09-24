export const roles = ["admin", "user"] as const;

export type Role = (typeof roles)[number];

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  roles: Role[];
};

export type Session = {
  user: SessionUser;
};
