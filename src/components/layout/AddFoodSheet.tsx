import React, { useEffect, useState } from 'react';
import {
  AddIcon,
  BoltIcon,
  ChevronRightIcon,
  RemoveIcon,
} from '../icons/IconComponents';
import postSubmit from '@/data/fetch/postSubmit';
import { useRouter } from 'next/navigation';
import { Food } from '@/app/(pages)/home/MealCard';
import { FoodData } from '@/types';
import useDateStore from '@/zustand/dateStore';
import moment from 'moment';

const mealTypes: { [key: string]: { kr: string; en: string } } = {
  breakfast: { kr: '아침', en: 'breakfast' },
  lunch: { kr: '점심', en: 'lunch' },
  dinner: { kr: '저녁', en: 'dinner' },
  snack: { kr: '간식', en: 'snack' },
};

const mealTypeKeys = Object.keys(mealTypes);

interface Props {
  type?: string;
  foodData: FoodData;
  setIsOpened: (isOpen: boolean) => void;
}

const AddFoodSheet: React.FC<Props> = ({ type, foodData, setIsOpened }) => {
  const { FOOD_NM_KR: name } = foodData;
  let {
    AMT_NUM1: enerc,
    AMT_NUM7: chocdf,
    AMT_NUM3: prot,
    AMT_NUM4: fatce,
    SERVING_SIZE: size,
  } = foodData;

  // 값이 없을 경우 0으로 설정
  enerc = enerc || '0';
  chocdf = chocdf || '0';
  prot = prot || '0';
  fatce = fatce || '0';
  size = size || '0';

  const [isServing, setIsServing] = useState(true);
  const [quantity, setQuantity] = useState<string>('1'); // 초기값을 '1'로 설정
  const [isInputting, setIsInputting] = useState(false); // 사용자가 입력 중인지 추적
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const [nutrient, setNutrient] = useState({
    enerc: enerc,
    prot: prot,
    fatce: fatce,
    chocdf: chocdf,
  });

  const { getDate } = useDateStore();

  // 탭 메뉴로 들어온 경우, 오늘 날짜를 기본값으로 설정
  function getDay(day = 0) {
    return moment().add(day, 'days').format('YYYY.MM.DD');
  }

  // type이 있다면 currentIndex를 변경
  useEffect(() => {
    if (type) {
      setCurrentIndex(mealTypeKeys.indexOf(type));
    }
  }, [type]);

  // quantity가 변경될 때마다 nutrient 값을 계산
  useEffect(() => {
    if (parseInt(quantity) > 0) {
      setNutrient(calculatedValues());
    }
  }, [quantity]);

  const handleCloseSheet = (e: React.MouseEvent) => {
    // 클릭된 요소가 배경일 경우에만 시트를 닫음
    if (e.target === e.currentTarget) {
      setIsOpened(false);
    }
  };

  // 인분/그램 선택 토글
  const toggle = () => {
    setIsServing(!isServing);
    if (isServing) {
      setQuantity('100');
    } else {
      setQuantity('1');
    }
  };

  // 섭취량 조절 버튼(minus)
  const handleSubtract = () => {
    let current = parseFloat(quantity);
    if (isInputting) {
      current = Math.round(current);
      setIsInputting(false);
    }
    if (current > 0.5) {
      setQuantity((current - 0.5).toString());
    }
  };

  // 섭취량 조절 버튼(plus)
  const handleAdd = () => {
    let current = parseFloat(quantity);
    if (isInputting) {
      current = Math.round(current);
      setIsInputting(false);
    }
    setQuantity((current + 0.5).toString());
  };

  // 섭취량 입력창 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsInputting(true); // 사용자가 입력 중임을 표시
    setQuantity(value);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? mealTypeKeys.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === mealTypeKeys.length - 1 ? 0 : prev + 1));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mealType = mealTypeKeys[currentIndex]; // 현재 선택된 끼니 정보

    const formData = {
      type: mealType,
      title: type ? getDate() : getDay(),
      extra: {
        foodNm: name?.replaceAll('_', ' '),
        enerc: nutrient.enerc,
        inputQua: isServing
          ? `${parseFloat(quantity) * parseFloat(size)}`
          : `${parseFloat(quantity)}`,
        prot: nutrient.prot,
        fatce: nutrient.fatce,
        chocdf: nutrient.chocdf,
        foodSize: size,
      },
    };

    postDiet(formData);
  };

  // 실제 섭취량에 따른 영양소 값을 계산하는 로직
  const calculatedValues = () => {
    const ratio = isServing
      ? parseFloat(quantity)
      : parseFloat(quantity) / parseFloat(size);

    return {
      enerc: (parseFloat(enerc) * ratio).toFixed(0),
      prot: (parseFloat(prot) * ratio).toFixed(0),
      fatce: (parseFloat(fatce) * ratio).toFixed(0),
      chocdf: (parseFloat(chocdf) * ratio).toFixed(0),
    };
  };

  const postDiet = async (data: {
    private?: boolean;
    type: string;
    title: string;
    extra: Food;
  }) => {
    try {
      data.private = true;
      await postSubmit({
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('식단 기록 오류', error);
    } finally {
      router.push(
        `/meals/${mealTypeKeys[currentIndex]}/${type ? getDate() : getDay()}`,
      );
    }
  };

  // TODO: 음식 상세 페이지로 이동
  const handleOpenDetail = () => {
    router.push('/nutrition');
  };

  return (
    <div
      className="overflow-hidden absolute w-full min-h-screen h-full bg-black/70 z-30 flex flex-col justify-end"
      onClick={handleCloseSheet}
    >
      <div className="max-w-[475px] w-full bg-white rounded-t-3xl py-14 px-12 flex flex-col gap-8 fixed bottom-0">
        <h2 className="font-semibold leading-5 text-2xl">
          {name.replaceAll('_', ' ')}
        </h2>
        <div className="w-full flex flex-col gap-6 items-center">
          {/* 칼로리 카드 */}
          <div className="w-full">
            <div className="flex flex-col items-center justify-between px-8 py-6 bg-[#FFF7E1] rounded-2xl text-center">
              <div className="flex justify-center space-x-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold">
                    탄
                  </div>
                  <span className="font-semibold">{nutrient.chocdf}g</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold">
                    단
                  </div>
                  <span className="font-semibold">{nutrient.prot}g</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold">
                    지
                  </div>
                  <span className="font-semibold">{nutrient.fatce}g</span>
                </div>
              </div>
              <div className="font-semibold text-xl">{nutrient.enerc}kcal</div>
            </div>
          </div>
          <form
            id="addFood"
            onSubmit={onSubmit}
            className="w-full flex flex-col gap-4"
          >
            {/* 인분/그람 선택 */}
            {/* <BinaryToggleButton /> */}
            <div
              className={`w-full py-4 px-1 flex items-center rounded-full cursor-pointer bg-[#FFF7E1] relative`}
              onClick={toggle}
            >
              <div
                className={`${
                  isServing ? 'translate-x-0' : 'translate-x-full'
                } transform transition-transform duration-300 bg-white rounded-full w-[49%] py-3 flex items-center justify-center absolute top-1 bottom-1`}
              ></div>
              <div className="w-1/2 text-center z-10">
                <span className="font-medium text-gray-700">인분 ({size})</span>
              </div>
              <div className="w-1/2 text-center z-10">
                <span className="font-medium text-gray-700">g</span>
              </div>
            </div>

            {/* 용량 입력 */}
            {/* <ServingInput /> */}
            <div className="w-full flex items-center justify-between bg-[#FFF7E1] rounded-full py-4 px-4">
              <button
                type="button"
                onClick={handleSubtract}
                className={`text-gray-700 rotate-180 ${isInputting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isInputting}
              >
                <RemoveIcon />
              </button>
              {isServing ? (
                <input
                  type="number"
                  value={quantity}
                  onChange={handleChange}
                  className="text-center font-semibold text-gray-800 bg-transparent w-12 focus:outline-none"
                  min="0"
                  step="0.5"
                />
              ) : (
                <input
                  type="number"
                  value={quantity}
                  defaultValue={100}
                  onChange={handleChange}
                  className="text-center font-semibold text-gray-800 bg-transparent w-12 focus:outline-none"
                  min="0"
                  step="0.5"
                />
              )}
              <button
                type="button"
                onClick={handleAdd}
                className="text-gray-700"
              >
                <AddIcon />
              </button>
            </div>

            {/* 끼니 선택 */}
            {/* <Swiper /> */}
            <div className="w-full flex items-center justify-between bg-[#FFF7E1] rounded-full py-4 px-4 space-x-4">
              <button
                type="button"
                onClick={handlePrev}
                className="rotate-180 disabled:cursor-not-allowed"
                disabled={!!type}
              >
                <ChevronRightIcon fill={type && '#FFF7E1'} />
              </button>
              <div className="font-semibold">
                {mealTypes[mealTypeKeys[currentIndex]].kr}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="disabled:cursor-not-allowed"
                disabled={!!type}
              >
                <ChevronRightIcon fill={type && '#FFF7E1'} />
              </button>
            </div>
          </form>
        </div>
        <div className="flex gap-4 w-full">
          <button
            type="button"
            className="w-4/12 rounded-full h-12 border-2 border-[#ffb800] text-center font-semibold leading-7 text-lg text-[#ffb800]"
            onClick={handleOpenDetail}
          >
            음식 상세
          </button>
          <button
            form="addFood"
            type="submit"
            className="flex-grow rounded-full h-12 bg-[#ffb800] text-center font-semibold leading-7 text-lg text-neutral-100 flex justify-center items-center gap-1 pr-2"
          >
            <BoltIcon />
            <p>빠른 추가</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFoodSheet;
