import React, { useState } from 'react';
import BoxFrame from './BoxFrame';
import SubtitleBox from './SubtitleBox';
import ContentBox from './ContentBox';
import CustomAccordion from './CustomAccordion';

export default function BoxFrameEx() {
  // Accordion에서 데이터를 불러오는 로딩 상태를 관리
  const [loading, setLoading] = useState(false);

  // 예시로 사용할 데이터를 설정
  const sampleContent =
    'This is a sample content for the ContentBox. It can be any text or JSX content.';
  const additionalContent = 'This is additional content inside the accordion.';
  const detailedContent = 'More details about the content can be found here.';

  // 아코디언에서 데이터를 불러오는 시뮬레이션 함수
  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000); // 1초 후 로딩 완료
  };

  // 아코디언이 열릴 때 데이터를 불러옴
  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    if (isExpanded) {
      fetchData();
    }
  };

  return (
    <BoxFrame title="Box Frame Example">
      {/* Subtitle과 ContentBox를 함께 사용한 예시 */}
      <SubtitleBox subtitle="Example Subtitle">
        <ContentBox>{sampleContent} </ContentBox>
      </SubtitleBox>

      {/* Accordion을 사용한 예시 */}
      <CustomAccordion
        title="Click to Expand"
        content={loading ? 'Loading...' : detailedContent}
        onChange={handleAccordionChange}
        loading={loading}
      >
        {/* 아코디언 내부에 추가적으로 ContentBox를 포함할 수 있음 */}
        <ContentBox>{additionalContent} </ContentBox>
      </CustomAccordion>

      {/* 추가적으로 다른 SubtitleBox와 ContentBox를 사용할 수 있음 */}
      <SubtitleBox subtitle="Another Subtitle">
        <ContentBox>Another piece of content goes here.</ContentBox>
      </SubtitleBox>
    </BoxFrame>
  );
}
