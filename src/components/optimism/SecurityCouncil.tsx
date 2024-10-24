import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
} from '@mui/material';
import { L1_SECURITY_COUNCIL_ADDRESS } from '../../constants/optimism/address';
import {
  getMembersOfL1SecurityCouncil,
  getThresholdOfL1SecurityCouncil,
  getBalanceOnL1,
} from '../../utils/optimism/getSecurityCouncil';

import BoxFrame from '../common/BoxFrame';
import SubtitleBox from '../common/SubtitleBox';
import ContentBox from '../common/ContentBox';
import CustomAccordion from '../common/CustomAccordion';
import { API_URLS } from '../../constants/common/url';
import { SECURITY_COUNCIL_CONTENTS } from '../../constants/optimism/contents';

// ETH 변환 함수
const formatBalance = (balance: bigint) => Number(balance) / 10 ** 18; // .toFixed(4);

// 주소를 '앞에 8글자...뒤에 6글자' 형태로 축약하는 함수
const formatAddress = (address: string) =>
  address.length >= 14
    ? `${address.slice(0, 8)}...${address.slice(-6)}`
    : address;

// L1/L2 주소 링크 생성 함수
const createLink = (address: string, isL1: boolean) =>
  isL1
    ? API_URLS.getEtherscanAddressUrl(address)
    : API_URLS.getOptimismScanAddressUrl(address);

export default function SecurityCouncil() {
  const [l1Threshold, setL1Threshold] = useState<bigint | null>(null);
  const [l1Members, setL1Members] = useState<string[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  // fetchData 함수
  const fetchData = async () => {
    setLoading(true);
    try {
      const l1MembersData = await getMembersOfL1SecurityCouncil();
      const l1ThresholdData = await getThresholdOfL1SecurityCouncil();
      setL1Members(l1MembersData);
      setL1Threshold(l1ThresholdData);

      const l1BalancePromises = l1MembersData.map(async member => ({
        member,
        balance: formatBalance(BigInt(await getBalanceOnL1({ addr: member }))),
      }));

      const l1BalancesResult = await Promise.all(l1BalancePromises);

      const balanceObj: Record<string, number> = {};
      l1BalancesResult.forEach(({ member, balance }) => {
        balanceObj[`L1-${member}`] = balance;
      });

      setBalances(balanceObj);
      setDataFetched(true); // 데이터가 성공적으로 호출됨을 표시
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 아코디언이 열릴 때 데이터 호출
  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    if (isExpanded && !dataFetched) {
      fetchData();
    }
  };

  const renderTable = () => {
    const totalMembers = Math.max(l1Members.length);

    return (
      <TableContainer component={Paper}>
        <Table
          sx={{
            borderCollapse: 'collapse',
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: '1px solid black' }}>
                <Link
                  href={createLink(L1_SECURITY_COUNCIL_ADDRESS, true)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  L1 Security Council
                </Link>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ border: '1px solid black' }}>
                Multisig Threshold:{' '}
                <Box
                  sx={{
                    display: 'inline-block',
                    border: '0.9px solid black',
                    padding: '4px 8px',
                    borderRadius: 1,
                  }}
                >
                  {l1Threshold?.toString()}
                </Box>{' '}
                / {l1Members.length}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(totalMembers)].map((_, index) => {
              const l1Member = l1Members[index];

              return (
                <TableRow key={`${l1Member || ''}-`}>
                  <TableCell sx={{ border: '1px solid black' }}>
                    {l1Member ? (
                      <>
                        <Link
                          href={createLink(l1Member, true)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {formatAddress(l1Member)}
                        </Link>
                        <Box
                          sx={{
                            display: 'inline-block',
                            border: '0.9px solid black',
                            p: 0.5,
                            ml: 1,
                          }}
                        >
                          {`${balances[`L1-${l1Member}`]} ETH`}
                        </Box>
                      </>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <BoxFrame title="Security Council">
      <SubtitleBox subtitle="Summary">
        <ContentBox>{SECURITY_COUNCIL_CONTENTS.SUMMARY}</ContentBox>
      </SubtitleBox>
      <CustomAccordion
        title="More Details"
        content={renderTable()}
        onChange={handleAccordionChange}
        loading={loading}
      />
      <SubtitleBox subtitle="The process of being upgraded with the authority of the Security Council.">
        <ContentBox>
          {SECURITY_COUNCIL_CONTENTS.PROCESS_SECURITY_COUNCIL}
        </ContentBox>
      </SubtitleBox>
      <SubtitleBox subtitle="proposer upgrade">
        <ContentBox>{SECURITY_COUNCIL_CONTENTS.PROPOSER_UPGRADE}</ContentBox>
      </SubtitleBox>
      <SubtitleBox subtitle="Emergency upgrade">
        <ContentBox>{SECURITY_COUNCIL_CONTENTS.EMERGENCY_UPGRADE}</ContentBox>
      </SubtitleBox>
    </BoxFrame>
  );
}
