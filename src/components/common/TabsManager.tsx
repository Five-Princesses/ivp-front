import { Tab, Tabs } from '@mui/material';
import React from 'react';

interface TabsManagerProps {
  ref: React.RefObject<HTMLDivElement>; // 탭을 관리하는 컴포넌트의 ref
  value: string; // 탭의 현재 상태를 나타내는 값
}

function TabsManager({ ref, value }: TabsManagerProps) {
  //   const handleChange = useCallback(
  //     (newValue: string, _event: React.SyntheticEvent) => {
  //       // 탭 변경 시 상태 업데이트
  //       console.log(newValue);
  //     },
  //     [] // Add an empty dependency array if there are no dependencies
  //   );

  return (
    <div ref={ref}>
      <Tabs
        value={value}
        // onChange={(_event, newValue) => handleChange(newValue, _event)}
      >
        <Tab value="status" label="Arbitrum Status" />
        <Tab value="gas" label="Gas Used" />
        <Tab value="securitycouncil" label="Security Council" />
      </Tabs>
    </div>
  );
}

export default TabsManager;
