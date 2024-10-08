import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Tab, Tabs } from '@mui/material';

interface TabsManagerProps {
  sectionsRef: {
    status: React.RefObject<HTMLDivElement>;
    gas: React.RefObject<HTMLDivElement>;
    securitycouncil: React.RefObject<HTMLDivElement>;
  };
}

function TabsManager({ sectionsRef }: TabsManagerProps) {
  const [value, setValue] = useState<string>('status');
  const tabsRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  useEffect(() => {
    if (tabsRef.current) {
      const tabsHeight = tabsRef.current.clientHeight;
      setHeaderHeight(tabsHeight - 48);
    }
  }, []);

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

      for (let i = 0; i < sections.length; i += 1) {
        const currentSection = sections[i];
        const nextSection = sections[i + 1];

        const currentSectionTop = currentSection.ref.current
          ? currentSection.ref.current.getBoundingClientRect().top +
            window.scrollY
          : 0;
        const nextSectionTop = nextSection?.ref.current
          ? nextSection.ref.current.getBoundingClientRect().top + window.scrollY
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

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue);

      const targetSection = sectionsRef[newValue as keyof typeof sectionsRef];

      if (targetSection.current) {
        const targetPosition =
          targetSection.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: targetPosition - headerHeight,
          behavior: 'smooth',
        });
      }
    },
    [sectionsRef, headerHeight]
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
