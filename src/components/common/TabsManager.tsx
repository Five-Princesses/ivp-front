import { Tab, Tabs } from '@mui/material';
import React, { memo, useCallback, useState } from 'react';

interface TabsManagerProps {
  onTabChange: (newValue: string) => void; // 부모에게 상태 전달 함수
}

// TabsManager 내부에서 상태 관리
function TabsManager({ onTabChange }: TabsManagerProps) {
  const [value, setValue] = useState<string>('status');

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue);
      onTabChange(newValue); // 부모에게 상태 변경 알림 전달
    },
    [onTabChange]
  );

  return (
    <div>
      <Tabs value={value} onChange={handleChange}>
        <Tab value="status" label="Arbitrum Status" />
        <Tab value="gas" label="Gas Used" />
        <Tab value="securitycouncil" label="Security Council" />
      </Tabs>
    </div>
  );
}

export default memo(TabsManager);
