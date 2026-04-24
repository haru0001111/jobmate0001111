export type CurrentUser = {
  id: string;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  return { id: 'demo-user' };
}
