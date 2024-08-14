import { FoodDataResponse } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const foodApiFetch = async (
  foodName: string,
): Promise<FoodDataResponse | null> => {
  try {
    const url =
      'https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo01/getFoodNtrCpntDbInq01';
    const queryParams =
      '?' +
      encodeURIComponent('serviceKey') +
      '=' +
      encodeURIComponent(API_KEY ?? '') +
      '&' +
      encodeURIComponent('pageNo') +
      '=' +
      encodeURIComponent('1') +
      '&' +
      encodeURIComponent('numOfRows') +
      '=' +
      encodeURIComponent('10') +
      '&' +
      encodeURIComponent('type') +
      '=' +
      encodeURIComponent('json') +
      '&' +
      encodeURIComponent('FOOD_NM_KR') +
      '=' +
      encodeURIComponent(foodName);

    const response = await fetch(url + queryParams);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const resJson = await response.json();
    return resJson.body;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};