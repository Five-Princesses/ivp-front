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
} from '../../utils/getSecurityCouncil';

import BoxFrame from '../common/BoxFrame';
import SubtitleBox from '../common/SubtitleBox';
import ContentBox from '../common/ContentBox';
import CustomAccordion from '../common/CustomAccordion';

// ETH 변환 함수
const formatBalance = (balance: bigint) => Number(balance) / 10 ** 18; // .toFixed(4);

// 주소를 '앞에 8글자...뒤에 6글자' 형태로 축약하는 함수
const formatAddress = (address: string) =>
  `${address.slice(0, 8)}...${address.slice(-6)}`;

// L1/L2 주소 링크 생성 함수
const createLink = (address: string, isL1: boolean) =>
  isL1
    ? `https://etherscan.io/address/${address}`
    : `https://optimistic.etherscan.io/address/${address}`;

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
        <ContentBox
          content="The Security Council can perform upgrades when it secures 9 out of 12 signatures 
        from its members. Regular upgrades will incur a 12-day and 8-hour delay. However, in the case of a security threat, an emergency upgrade can be executed immediately without delay. Additionally, during the timelock period, the Security Council also holds the authority to cancel the upgrade."
        />
      </SubtitleBox>
      <CustomAccordion
        title="More Details"
        content={renderTable()}
        onChange={handleAccordionChange}
        loading={loading}
      />
      <SubtitleBox subtitle="The process of being upgraded with the authority of the Security Council.">
        <ContentBox content="In a typical upgrade process, discussions are initiated on the Arbitrum DAO forum, followed by a yes/no vote on Snapshot, and then an on-chain vote through Tally before the upgrade is implemented. However, for the Security Council, an upgrade can be executed without going through the voting process, provided it obtains signatures from at least 9 out of the 12 Security Council members. Upgrades are classified into two categories: proposer upgrades and emergency upgrades, and depending on the type, contracts are divided into the L2 Proposer Security Council, L2 Emergency Security Council, and L1 Security Council. Although their roles are differentiated, the same Security Council members must constitute each of the contracts." />
      </SubtitleBox>
      <SubtitleBox subtitle="proposer upgrade">
        <ContentBox
          content="All upgrades begin on Layer 2 (L2). A proposer upgrade is initiated by the L2 Proposer Security Council, and after passing through a 3-day L2 Timelock, it moves to the outbox. If there is disagreement with the upgrade, users have a 2-day window to exit L2 during the 3-day L2 Timelock period, excluding the one-day delay for forcibly executing a transaction on Layer 1 (L1).

A 6-day and 8-hour challenge period occurs, and if no issues arise, the upgrade is sent to the L1 Timelock, where there is an additional 3-day delay. During the 3-day L2 Timelock period, the L2 Emergency Security Council has the authority to cancel the upgrade, and during the 3-day L1 Timelock period, the L1 Security Council has the authority to cancel the upgrade.

After the L1 Timelock period, the upgrade is sent back to L2 via the inbox, where all L2 system contracts are upgraded through the L2 Upgrade Executor. Simultaneously, all L1 system contracts are upgraded using the Upgrade Executor module on L1."
        />
      </SubtitleBox>
      <SubtitleBox subtitle="Emergency upgrade">
        <ContentBox content="In the case of an emergency upgrade, when a security threat is detected, swift action is required, so a long upgrade process like the proposer upgrade is not suitable. Therefore, the L2 Emergency Security Council immediately executes the L2 Upgrade Executor to upgrade all system contracts on Layer 2 (L2). Simultaneously, the L1 Emergency Security Council executes the Upgrade Executor to upgrade all system contracts on Layer 1 (L1). After the emergency upgrade is carried out, the Emergency Security Council is required to submit a transparency report regarding the upgrade." />
      </SubtitleBox>
    </BoxFrame>
  );
}