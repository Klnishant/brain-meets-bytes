export async function getUser() {
  const { token, userId } = await fetch('/api/auth/getAuth').then(res => res.json());

  if (!token || !userId) return null;

  const res = await fetch(
    `http://54.172.93.35:7000/api//users/one?userId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    }
  );
  if (!res.ok) return null;
  return res.json();
}