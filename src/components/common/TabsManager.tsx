import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { throttle } from 'lodash';
import { TabsManagerProps } from '../../utils/common/types';

function TabsManager({ sectionsRef, tabs }: TabsManagerProps) {
  const [value, setValue] = useState<string>('status');
  const tabsRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  // 전체 헤더 높이(즉, PageHeader + TabsManager 높이) 계산
  useEffect(() => {
    if (sectionsRef.header.current) {
      // headerRef의 전체 높이 측정
      const totalHeaderHeight = sectionsRef.header.current.clientHeight + 50;
      setHeaderHeight(totalHeaderHeight);
    }
  }, [sectionsRef.header]); // headerRef의 초기화가 완료된 후에만 실행

  // 스크롤 위치를 감지하여 탭 상태 업데이트
  useEffect(() => {
    // `throttle` 적용하여 `handleScroll` 함수를 제한
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY + headerHeight;

      const sections = Object.keys(sectionsRef)
        .filter(key => key !== 'header')
        .map(key => ({
          ref: sectionsRef[key as keyof typeof sectionsRef],
          name: key,
        }));

      for (let i = 0; i < sections.length; i += 1) {
        const currentSection = sections[i];
        const nextSection = sections[i + 1];

        const currentSectionTop = currentSection.ref.current
          ? currentSection.ref.current.getBoundingClientRect().top +
            window.scrollY -
            headerHeight
          : 0;
        const nextSectionTop = nextSection?.ref.current
          ? nextSection.ref.current.getBoundingClientRect().top +
            window.scrollY -
            headerHeight
          : Number.MAX_VALUE;

        if (
          scrollPosition >= currentSectionTop &&
          scrollPosition < nextSectionTop
        ) {
          setValue(currentSection.name);
          break;
        }
      }
    }, 100); // 100ms로 throttle 설정

    window.addEventListener('scroll', handleScroll);

    // 클린업 함수: 이벤트 리스너 및 throttle 해제
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel(); // `throttle` 해제
    };
  }, [headerHeight, sectionsRef]);

  // 탭 변경 시 스크롤 이동 처리
  const handleChange = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue);

      const targetSection = sectionsRef[newValue as keyof typeof sectionsRef];

      if (targetSection.current) {
        const targetPosition =
          targetSection.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: targetPosition - headerHeight, // 정확한 위치 보정
          behavior: 'smooth',
        });
      }
    },
    [sectionsRef, headerHeight] // headerHeight가 변경될 때만 함수 재생성
  );

  return (
    <div ref={tabsRef}>
      <Tabs value={value} onChange={handleChange}>
        {tabs.map(tab => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
    </div>
  );
}

export default memo(TabsManager);
