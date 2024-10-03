import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  getMembersOfL1SecurityCouncil,
  getThresholdOfL1SecurityCouncil,
  getMembersOfL2SecurityCouncil,
  getThresholdOfL2SecurityCouncil,
  getMembersOfL2SecurityCouncilPropose,
  getThresholdOfL2SecurityCouncilPropose,
  getBalanceOnL1,
  getBalanceOnL2,
  L1_SECURITY_COUNCIL_ADDRESS,
  L2_SECURITY_COUNCIL_ADDRESS,
  L2_SECURITY_COUNCIL_PROPOSE_ADDRESS,
} from './arbHook/SecurityCouncilHook';

// ETH 변환 함수 (소수점까지 정확히 변환)
const formatBalance = (balance: bigint) => {
  return (Number(balance) / 10 ** 18).toFixed(4); // wei -> ether 변환 (소수점 4자리)
};

// 주소를 '앞에 8글자...뒤에 6글자' 형태로 축약하는 함수
const formatAddress = (address: string) => {
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
};

// L1 주소 링크 생성 함수
const createL1Link = (address: string) => {
  return `https://etherscan.io/address/${address}`;
};

// L2 주소 링크 생성 함수
const createL2Link = (address: string) => {
  return `https://arbiscan.io/address/${address}`;
};

export default function SecurityCouncil() {
  const [l1Threshold, setL1Threshold] = useState<bigint | null>(null);
  const [l1Members, setL1Members] = useState<string[]>([]);
  const [l2Threshold, setL2Threshold] = useState<bigint | null>(null);
  const [l2Members, setL2Members] = useState<string[]>([]);
  const [l2ProposeThreshold, setL2ProposeThreshold] = useState<bigint | null>(
    null
  );
  const [l2ProposeMembers, setL2ProposeMembers] = useState<string[]>([]);
  const [balances, setBalances] = useState<Record<string, string>>({}); // 잔액을 저장할 객체
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [dataFetched, setDataFetched] = useState(false); // 데이터가 이미 호출되었는지 여부를 관리

  const fetchData = async () => {
    setLoading(true); // 로딩 시작
    try {
      // L1 Security Council 데이터 가져오기
      const l1MembersData = await getMembersOfL1SecurityCouncil();
      const l1ThresholdData = await getThresholdOfL1SecurityCouncil();
      setL1Members(l1MembersData);
      setL1Threshold(l1ThresholdData);

      // L2 Security Council 데이터 가져오기
      const l2MembersData = await getMembersOfL2SecurityCouncil();
      const l2ThresholdData = await getThresholdOfL2SecurityCouncil();
      setL2Members(l2MembersData);
      setL2Threshold(l2ThresholdData);

      // L2 Propose Security Council 데이터 가져오기
      const l2ProposeMembersData = await getMembersOfL2SecurityCouncilPropose();
      const l2ProposeThresholdData =
        await getThresholdOfL2SecurityCouncilPropose();
      setL2ProposeMembers(l2ProposeMembersData);
      setL2ProposeThreshold(l2ProposeThresholdData);

      // L1, L2, L2 Propose 멤버 잔액 가져오기
      const l1BalancePromises = l1MembersData.map(async member => {
        const balance = await getBalanceOnL1({ addr: member });
        return {
          member,
          balance: formatBalance(BigInt(balance)),
          council: 'L1',
        }; // L1 Security Council로 구분
      });

      const l2BalancePromises = l2MembersData.map(async member => {
        const balance = await getBalanceOnL2({ addr: member });
        return {
          member,
          balance: formatBalance(BigInt(balance)),
          council: 'L2',
        }; // L2 Security Council로 구분
      });

      const l2ProposeBalancePromises = l2ProposeMembersData.map(
        async member => {
          const balance = await getBalanceOnL2({ addr: member });
          return {
            member,
            balance: formatBalance(BigInt(balance)),
            council: 'L2Propose',
          }; // L2 Propose Security Council로 구분
        }
      );

      const l1BalancesResult = await Promise.all(l1BalancePromises);
      const l2BalancesResult = await Promise.all(l2BalancePromises);
      const l2ProposeBalancesResult = await Promise.all(
        l2ProposeBalancePromises
      );

      // 잔액 결과를 객체로 저장 (council 구분)
      const balanceObj: Record<string, string> = {};
      l1BalancesResult.forEach(({ member, balance }) => {
        balanceObj[`L1-${member}`] = balance;
      });
      l2BalancesResult.forEach(({ member, balance }) => {
        balanceObj[`L2-${member}`] = balance;
      });
      l2ProposeBalancesResult.forEach(({ member, balance }) => {
        balanceObj[`L2Propose-${member}`] = balance;
      });

      setBalances(balanceObj);
      setDataFetched(true); // 데이터가 성공적으로 호출되었음을 표시
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  const areAllMembersSame = () => {
    const sortedMembers = [
      l1Members.slice(),
      l2Members.slice(),
      l2ProposeMembers.slice(),
    ];

    // 정렬된 복사본을 사용하여 비교 (원본 데이터는 변경하지 않음)
    return sortedMembers.every(
      (members, _, array) =>
        JSON.stringify(members.sort()) === JSON.stringify(array[0].sort())
    );
  };

  const areAllThresholdsSame = () => {
    return l1Threshold === l2Threshold && l2Threshold === l2ProposeThreshold;
  };

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    // 아코디언이 열리고 데이터가 아직 로드되지 않았다면 데이터 호출
    if (isExpanded && !dataFetched) {
      fetchData();
    }
  };

  const renderTable = () => {
    const totalMembers = Math.max(
      l1Members.length,
      l2Members.length,
      l2ProposeMembers.length
    );

    return (
      <TableContainer component={Paper}>
        <Table sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: '1px solid black' }}>
                <Link
                  href={createL1Link(L1_SECURITY_COUNCIL_ADDRESS)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  L1 Security Council
                </Link>
              </TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                <Link
                  href={createL2Link(L2_SECURITY_COUNCIL_ADDRESS)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  L2 Security Council
                </Link>
              </TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                <Link
                  href={createL2Link(L2_SECURITY_COUNCIL_PROPOSE_ADDRESS)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  L2 Security Council Propose
                </Link>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ border: '1px solid black' }}>
                Multisig Threshold:{' '}
                <Box
                  sx={{ display: 'inline-block', bgcolor: '#f0f0f0', p: 0.5 }}
                >
                  {l1Threshold?.toString()}
                </Box>{' '}
                / {l1Members.length}
              </TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                Multisig Threshold:{' '}
                <Box
                  sx={{ display: 'inline-block', bgcolor: '#f0f0f0', p: 0.5 }}
                >
                  {l2Threshold?.toString()}
                </Box>{' '}
                / {l2Members.length}
              </TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                Multisig Threshold:{' '}
                <Box
                  sx={{ display: 'inline-block', bgcolor: '#f0f0f0', p: 0.5 }}
                >
                  {l2ProposeThreshold?.toString()}
                </Box>{' '}
                / {l2ProposeMembers.length}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(totalMembers)].map((_, index) => (
              <TableRow
                key={
                  l1Members[index] ||
                  l2Members[index] ||
                  l2ProposeMembers[index] ||
                  `member-${index}`
                }
              >
                <TableCell sx={{ border: '1px solid black' }}>
                  {l1Members[index] ? (
                    <Link
                      href={createL1Link(l1Members[index])}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formatAddress(l1Members[index])}
                    </Link>
                  ) : null}{' '}
                  {l1Members[index] && (
                    <Box
                      sx={{
                        display: 'inline-block',
                        bgcolor: '#f0f0f0',
                        p: 0.5,
                      }}
                    >
                      {balances[`L1-${l1Members[index]}`]} ETH
                    </Box>
                  )}
                </TableCell>
                <TableCell sx={{ border: '1px solid black' }}>
                  {l2Members[index] ? (
                    <Link
                      href={createL2Link(l2Members[index])}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formatAddress(l2Members[index])}
                    </Link>
                  ) : null}{' '}
                  {l2Members[index] && (
                    <Box
                      sx={{
                        display: 'inline-block',
                        bgcolor: '#f0f0f0',
                        p: 0.5,
                      }}
                    >
                      {balances[`L2-${l2Members[index]}`]} ETH
                    </Box>
                  )}
                </TableCell>
                <TableCell sx={{ border: '1px solid black' }}>
                  {l2ProposeMembers[index] ? (
                    <Link
                      href={createL2Link(l2ProposeMembers[index])}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formatAddress(l2ProposeMembers[index])}
                    </Link>
                  ) : null}{' '}
                  {l2ProposeMembers[index] && (
                    <Box
                      sx={{
                        display: 'inline-block',
                        bgcolor: '#f0f0f0',
                        p: 0.5,
                      }}
                    >
                      {balances[`L2Propose-${l2ProposeMembers[index]}`]} ETH
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex', // Flexbox 사용
        justifyContent: 'center', // 가로 가운데 정렬
      }}
    >
      <Box
        sx={{
          width: '90%',
          pt: 3,
          border: '2px solid black', // 박스 기본 테두리 색상
          '&:hover': {
            borderColor: 'red', // 마우스가 올라갔을 때 박스 테두리 빨간색
          },
          borderRadius: 2, // 둥근 테두리 모서리
          padding: 2, // 내부 여백
          mt: 4, // 박스 위쪽 여백
          mb: 4, // 박스 아래쪽 여백
        }}
      >
        {/* 제목 */}
        <Typography variant="h4" component="h2" gutterBottom>
          Security Council
        </Typography>

        {/* 소제목 */}
        <Typography variant="h5" component="h3" gutterBottom>
          Summary
        </Typography>
        {/* 내용 박스 */}
        <Box
          sx={{
            border: '1px solid black', // 내용 부분 기본 테두리 색상
            borderRadius: 1, // 내용 박스 테두리 모서리
            padding: 2, // 내용 내부 여백
            mt: 2, // 제목과의 간격
          }}
        >
          <Typography variant="body1" gutterBottom>
            The Security Council can perform upgrades when it secures 9 out of
            12 signatures from its members. Regular upgrades will incur a 12-day
            and 8-hour delay. However, in the case of a security threat, an
            emergency upgrade can be executed immediately without delay.
            Additionally, during the timelock period, the Security Council also
            holds the authority to cancel the upgrade.{' '}
          </Typography>
        </Box>

        {/* 클릭 시 펼쳐지는 스크롤 가능한 컴포넌트 */}
        <Accordion
          sx={{
            mt: 2,
            mb: 4,
            border: '1px solid black', // 아코디언 테두리 추가
            borderRadius: 1, // 둥근 테두리 모서리
            '&:before': {
              display: 'none', // 아코디언 기본 하이라이트 제거
            },
          }}
          onChange={handleAccordionChange}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>More Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <>
                {renderTable()}

                {/* 모든 멤버가 동일한지 확인 */}
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    border: '1px solid black',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body1">
                    All Members Are Same:{' '}
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        bgcolor: areAllMembersSame() ? 'blue' : 'red',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: 1,
                      }}
                    >
                      {areAllMembersSame() ? 'True' : 'False'}
                    </Box>
                  </Typography>
                </Box>

                {/* 모든 Threshold 값이 동일한지 확인 */}
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    border: '1px solid black',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body1">
                    All Thresholds Are Same:{' '}
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        bgcolor: areAllThresholdsSame() ? 'blue' : 'red',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: 1,
                      }}
                    >
                      {areAllThresholdsSame()
                        ? `True (${l1Threshold?.toString()})`
                        : 'False'}
                    </Box>
                  </Typography>
                </Box>
              </>
            )}
          </AccordionDetails>
        </Accordion>
        {/* 소제목 */}
        <Typography variant="h5" component="h3" gutterBottom>
          Upgrade Flow
        </Typography>

        {/* 내용 박스 */}
        <Box
          sx={{
            border: '1px solid black', // 내용 부분 기본 테두리 색상
            borderRadius: 1, // 내용 박스 테두리 모서리
            padding: 2, // 내용 내부 여백
            mt: 2, // 제목과의 간격
          }}
        >
          <Typography variant="body1" gutterBottom>
            Upgrade Complete
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
