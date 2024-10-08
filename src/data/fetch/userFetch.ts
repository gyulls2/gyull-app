import { ApiRes, SingleItem, UserData } from '@/types';

const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

// const LIMIT = process.env.NEXT_PUBLIC_LIMIT;
// const DELAY = process.env.NEXT_PUBLIC_DELAY;

/**
 * 사용자 정보 조회
 * @param _id 사용자 ID
 * @param accessToken 사용자 액세스 토큰
 * @returns 사용자 정보
 */
export async function fetchUser(_id: string, accessToken: string) {
  const url = `${SERVER}/users/${_id}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'client-id': `${CLIENT_ID}`,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const resJson: ApiRes<SingleItem<UserData>> = await res.json();
  if (!resJson.ok) {
    return null;
  }
  return resJson.item;
}

// 액세스 토큰 재발행
export async function fetchAccessToken(refreshToken: string) {
  const url = `${SERVER}/auth/refresh`;
  const res = await fetch(url, {
    headers: {
      'client-id': `${CLIENT_ID}`,
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  return res;
}
