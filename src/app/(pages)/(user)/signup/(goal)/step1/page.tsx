'use client';

import { SmileyIcon } from '@/components/icons/IconComponents';
import StepIndicator from '@/components/StepIndicator';
import WelcomeModal from '@/components/WelcomeModal';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PageContext } from '../LoyoutContent';

const Step1Page = () => {
  const {
    register,
    watch,
    trigger,
    setValue,
    formState: { isValid },
  } = useFormContext();
  const selectedGender = watch('gender');
  const selectedActive = watch('activity_level');
  const router = useRouter();
  const [isOpened, setIsOpened] = useState(true);
  const user = useContext(PageContext);

  useEffect(() => {
    if (user && user.extra) {
      setValue('gender', user.extra.gender);
      setValue('age', user.extra.age);
      setValue('height', user.extra.height);
      setValue('activity_level', user.extra.activity_level);
    }
  }, [user, setValue]);

  const handleNext = async () => {
    const isValid = await trigger([
      'gender',
      'age',
      'height',
      'activity_level',
    ]);
    if (isValid) {
      router.push('/signup/step2');
    }
  };

  return (
    <>
      {isOpened && user && !user.extra?.age && (
        <WelcomeModal setIsOpened={setIsOpened} />
      )}
      <div className="flex flex-col gap-6 min-h-full h-full">
        <StepIndicator current="1" />
        <h2 className="font-semibold leading-9 text-2xl text-gray-900">
          맞춤 목표 계산 시작!
          <br />
          기본 정보를 알려주세요
        </h2>
        <div className="flex flex-col items-start">
          <label
            className="text-center leading-7 text-sm text-[#757575] mb-2"
            htmlFor="gender"
          >
            성별
          </label>
          <div className="flex justify-center space-x-8 self-center">
            <label className="flex flex-col items-center cursor-pointer">
              <input
                type="radio"
                value="female"
                className="hidden"
                {...register('gender', { required: '성별은 필수입니다.' })}
              />
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedGender === 'female'
                    ? 'bg-main-secondary-yellow'
                    : 'bg-gray-200'
                }`}
              >
                <SmileyIcon />
              </div>
              <span className="text-gray-500 mt-4">여성</span>
            </label>
            <label className="flex flex-col items-center cursor-pointer">
              <input
                type="radio"
                value="male"
                className="hidden"
                {...register('gender', { required: '성별은 필수입니다.' })}
              />
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedGender === 'male'
                    ? 'bg-main-secondary-yellow'
                    : 'bg-gray-200'
                }`}
              >
                <SmileyIcon />
              </div>
              <span className="text-gray-500 mt-4">남성</span>
            </label>
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <label
              className="text-center leading-7 text-sm text-[#757575]"
              htmlFor="age"
            >
              나이
            </label>
            <div className="relative mt-2">
              <input
                id="age"
                type="number"
                placeholder="0"
                className="rounded-lg w-full h-14 bg-[#fff7e1] focus:outline-none focus:border-orange-400 px-6 font-semibold pr-14"
                {...register('age', {
                  required: '나이는 필수입니다.',
                  min: 1,
                  max: 100,
                })}
              />
              <span className="absolute bottom-4 right-6 text-gray-400 font-semibold">
                세
              </span>
            </div>
          </div>
          <div>
            <label
              className="text-center leading-7 text-sm text-[#757575]"
              htmlFor="height"
            >
              키
            </label>
            <div className="relative mt-2">
              <input
                id="height"
                type="number"
                placeholder="0"
                className="rounded-lg w-full h-14 bg-[#fff7e1] focus:outline-none focus:border-orange-400 px-6 font-semibold pr-14"
                {...register('height', {
                  required: '키는 필수입니다.',
                  min: 1,
                  max: 200,
                })}
              />
              <span className="absolute bottom-4 right-6 text-gray-400 font-semibold">
                cm
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <label
            className="text-center leading-7 text-sm text-[#757575] mb-4"
            htmlFor="activity_level"
          >
            평소 활동량
          </label>
          <div className="flex justify-center self-center space-x-2">
            <label className="flex flex-col items-center cursor-pointer">
              <input
                type="radio"
                value={1}
                className="hidden"
                {...register('activity_level', {
                  required: '활동량은 필수입니다.',
                })}
              />
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedActive === '1'
                    ? 'bg-main-secondary-yellow'
                    : 'bg-gray-200'
                }`}
              >
                <SmileyIcon />
              </div>
              <span className="text-gray-500 mt-4 mb-2">매우 적음</span>
              <p className="text-xs text-gray-500 text-center">
                활동이 거의 없는
                <br />
                집돌이 집순이
              </p>
            </label>
            <label className="flex flex-col items-center cursor-pointer">
              <input
                type="radio"
                value={2}
                className="hidden"
                {...register('activity_level', {
                  required: '활동량은 필수입니다.',
                })}
              />
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedActive === '2'
                    ? 'bg-main-secondary-yellow'
                    : 'bg-gray-200'
                }`}
              >
                <SmileyIcon />
              </div>
              <span className="text-gray-500 mt-4 mb-2">적음</span>
              <p className="text-xs text-gray-500 text-center">
                주로 앉아있는
                <br />
                학생이나 직장인
              </p>
            </label>
            <label className="flex flex-col items-center cursor-pointer">
              <input
                type="radio"
                value={3}
                className="hidden"
                {...register('activity_level', {
                  required: '활동량은 필수입니다.',
                })}
              />
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedActive === '3'
                    ? 'bg-main-secondary-yellow'
                    : 'bg-gray-200'
                }`}
              >
                <SmileyIcon />
              </div>
              <span className="text-gray-500 mt-4 mb-2">보통</span>
              <p className="text-xs text-gray-500 text-center">
                주 2~3회 정도
                <br />
                운동하는 꾸준러
              </p>
            </label>
            <label className="flex flex-col items-center cursor-pointer">
              <input
                type="radio"
                value={4}
                className="hidden"
                {...register('activity_level', {
                  required: '활동량은 필수입니다.',
                })}
              />
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedActive === '4'
                    ? 'bg-main-secondary-yellow'
                    : 'bg-gray-200'
                }`}
              >
                <SmileyIcon />
              </div>
              <span className="text-gray-500 mt-4 mb-2">많음</span>
              <p className="text-xs text-gray-500 text-center">
                매일 뛰거나
                <br />
                운동하는 갓생러
              </p>
            </label>
          </div>
        </div>

        <div className="mt-auto">
          <button
            className="rounded-full w-full h-14 bg-[#ffb800] disabled:opacity-50"
            disabled={!isValid}
            onClick={handleNext}
          >
            <p className="text-center font-semibold leading-5 text-lg text-neutral-100">
              다음
            </p>
          </button>
        </div>
      </div>
    </>
  );
};

export default Step1Page;
