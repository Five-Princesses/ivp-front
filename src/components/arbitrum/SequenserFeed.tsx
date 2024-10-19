import { Box } from '@mui/material';
import BoxFrame from '../common/BoxFrame';
import SubtitleBox from '../common/SubtitleBox';
import ContentBox from '../common/ContentBox';

export default function Dao() {
  return (
    <BoxFrame title="DAO Transactions">
      {/* 제목 및 설명 */}
      <SubtitleBox subtitle="subtitle">
        <ContentBox content="In the case of an emergency upgrade, when a security threat is detected, swift action is required, so a long upgrade process like the proposer upgrade is not suitable. Therefore, the L2 Emergency Security Council immediately executes the L2 Upgrade Executor to upgrade all system contracts on Layer 2 (L2). Simultaneously, the L1 Emergency Security Council executes the Upgrade Executor to upgrade all system contracts on Layer 1 (L1). After the emergency upgrade is carried out, the Emergency Security Council is required to submit a transparency report regarding the upgrade." />
      </SubtitleBox>

      {/* 컴포넌트 상세 설명 아코디언 */}
      <Box sx={{ marginTop: '24px' }}>aa</Box>
    </BoxFrame>
  );
}
