export async function getUser() {
  const { token, userId } = await fetch('/api/auth/getAuth').then(res => res.json());

  if (!token || !userId) return null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/one?userId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (!res.ok) return null;
  return res.json();
}