import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Tab, Tabs } from '@mui/material';

interface TabsManagerProps {
  sectionsRef: {
    header: React.RefObject<HTMLDivElement>;
    status: React.RefObject<HTMLDivElement>;
    gas: React.RefObject<HTMLDivElement>;
    securitycouncil: React.RefObject<HTMLDivElement>;
  };
}

function TabsManager({ sectionsRef }: TabsManagerProps) {
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
    const handleScroll = () => {
      // 정확한 스크롤 위치 보정
      const scrollPosition = window.scrollY + headerHeight;

      const sections = [
        { ref: sectionsRef.status, name: 'status' },
        { ref: sectionsRef.gas, name: 'gas' },
        { ref: sectionsRef.securitycouncil, name: 'securitycouncil' },
      ];

      // 각 섹션의 위치와 스크롤 위치를 출력하여 정확한 값을 확인
      sections.forEach(section => {
        const sectionTop = section.ref.current
          ? section.ref.current.getBoundingClientRect().top + window.scrollY
          : 0;
        console.log(`Section ${section.name} top:`, sectionTop);
      });

      // 스크롤 위치와 섹션 위치 비교하여 탭 상태 업데이트
      for (let i = 0; i < sections.length; i += 1) {
        const currentSection = sections[i];
        const nextSection = sections[i + 1];

        const currentSectionTop = currentSection.ref.current
          ? currentSection.ref.current.getBoundingClientRect().top +
            window.scrollY -
            headerHeight // headerHeight 반영
          : 0;
        const nextSectionTop = nextSection?.ref.current
          ? nextSection.ref.current.getBoundingClientRect().top +
            window.scrollY -
            headerHeight // headerHeight 반영
          : Number.MAX_VALUE;

        if (
          scrollPosition >= currentSectionTop &&
          scrollPosition < nextSectionTop
        ) {
          setValue(currentSection.name);
          console.log(`Current active section: ${currentSection.name}`);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionsRef, headerHeight]);

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
        <Tab value="status" label="Arbitrum Status" />
        <Tab value="gas" label="Gas Used" />
        <Tab value="securitycouncil" label="Security Council" />
      </Tabs>
    </div>
  );
}

export default memo(TabsManager);
