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
    : `https://arbiscan.io/address/${address}`;

export default function SecurityCouncil() {
  const [l1Threshold, setL1Threshold] = useState<bigint | null>(null);
  const [l1Members, setL1Members] = useState<string[]>([]);
  const [l2Threshold, setL2Threshold] = useState<bigint | null>(null);
  const [l2Members, setL2Members] = useState<string[]>([]);
  const [l2ProposeThreshold, setL2ProposeThreshold] = useState<bigint | null>(
    null
  );
  const [l2ProposeMembers, setL2ProposeMembers] = useState<string[]>([]);
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

      const l2MembersData = await getMembersOfL2SecurityCouncil();
      const l2ThresholdData = await getThresholdOfL2SecurityCouncil();
      setL2Members(l2MembersData);
      setL2Threshold(l2ThresholdData);

      const l2ProposeMembersData = await getMembersOfL2SecurityCouncilPropose();
      const l2ProposeThresholdData =
        await getThresholdOfL2SecurityCouncilPropose();
      setL2ProposeMembers(l2ProposeMembersData);
      setL2ProposeThreshold(l2ProposeThresholdData);

      const l1BalancePromises = l1MembersData.map(async member => ({
        member,
        balance: formatBalance(BigInt(await getBalanceOnL1({ addr: member }))),
      }));

      const l2BalancePromises = l2MembersData.map(async member => ({
        member,
        balance: formatBalance(BigInt(await getBalanceOnL2({ addr: member }))),
      }));

      const l2ProposeBalancePromises = l2ProposeMembersData.map(
        async member => ({
          member,
          balance: formatBalance(
            BigInt(await getBalanceOnL2({ addr: member }))
          ),
        })
      );

      const l1BalancesResult = await Promise.all(l1BalancePromises);
      const l2BalancesResult = await Promise.all(l2BalancePromises);
      const l2ProposeBalancesResult = await Promise.all(
        l2ProposeBalancePromises
      );

      const balanceObj: Record<string, number> = {};
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
      setDataFetched(true); // 데이터가 성공적으로 호출됨을 표시
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 멤버가 모두 동일한지 확인하는 함수
  const areAllMembersSame = () => {
    const sortedMembers = [
      l1Members.slice(),
      l2Members.slice(),
      l2ProposeMembers.slice(),
    ];

    return sortedMembers.every(
      (members, _, array) =>
        JSON.stringify(members.sort()) === JSON.stringify(array[0].sort())
    );
  };

  // Threshold 값이 모두 동일한지 확인하는 함수
  const areAllThresholdsSame = () => {
    return l1Threshold === l2Threshold && l2Threshold === l2ProposeThreshold;
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
    const totalMembers = Math.max(
      l1Members.length,
      l2Members.length,
      l2ProposeMembers.length
    );

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
              <TableCell sx={{ border: '1px solid black' }}>
                <Link
                  href={createLink(L2_SECURITY_COUNCIL_ADDRESS, false)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  L2 Security Council
                </Link>
              </TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                <Link
                  href={createLink(L2_SECURITY_COUNCIL_PROPOSE_ADDRESS, false)}
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
                  sx={{
                    display: 'inline-block',
                    border: '0.9px solid black',
                    color: 'black',
                    padding: '4px 8px',
                    borderRadius: 1,
                  }}
                >
                  {l1Threshold?.toString()}
                </Box>{' '}
                / {l1Members.length}
              </TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                Multisig Threshold:{' '}
                <Box
                  sx={{
                    display: 'inline-block',
                    border: '0.9px solid black',
                    color: 'black',
                    padding: '4px 8px',
                    borderRadius: 1,
                  }}
                >
                  {l2Threshold?.toString()}
                </Box>{' '}
                / {l2Members.length}
              </TableCell>
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
                  {l2ProposeThreshold?.toString()}
                </Box>{' '}
                / {l2ProposeMembers.length}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(totalMembers)].map((_, index) => {
              const l1Member = l1Members[index];
              const l2Member = l2Members[index];
              const l2ProposeMember = l2ProposeMembers[index];

              return (
                <TableRow
                  key={`${l1Member || ''}-${l2Member || ''}-${l2ProposeMember || ''}`}
                >
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
                          {balances[`L1-${l1Member}`]
                            ? `${balances[`L1-${l1Member}`]} ETH`
                            : 'N/A'}
                        </Box>
                      </>
                    ) : null}
                  </TableCell>

                  <TableCell sx={{ border: '1px solid black' }}>
                    {l2Member ? (
                      <>
                        <Link
                          href={createLink(l2Member, false)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {formatAddress(l2Member)}
                        </Link>
                        <Box
                          sx={{
                            display: 'inline-block',
                            border: '0.9px solid black',
                            p: 0.5,
                            ml: 1,
                          }}
                        >
                          {balances[`L2-${l2Member}`]
                            ? `${balances[`L2-${l2Member}`]} ETH`
                            : 'N/A'}
                        </Box>
                      </>
                    ) : null}
                  </TableCell>

                  <TableCell sx={{ border: '1px solid black' }}>
                    {l2ProposeMember ? (
                      <>
                        <Link
                          href={createLink(l2ProposeMember, false)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {formatAddress(l2ProposeMember)}
                        </Link>
                        <Box
                          sx={{
                            display: 'inline-block',
                            border: '0.9px solid black',
                            p: 0.5,
                            ml: 1,
                          }}
                        >
                          {balances[`L2Propose-${l2ProposeMember}`]
                            ? `${balances[`L2Propose-${l2ProposeMember}`]} ETH`
                            : 'N/A'}
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
      >
        <ContentBox
          content={
            <>
              All Members Are Same:{' '}
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  bgcolor: areAllMembersSame() ? 'blue' : 'red',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: 1,
                }}
              >
                {areAllMembersSame() ? 'True' : 'False'}
              </Box>
            </>
          }
        />

        <ContentBox
          content={
            <>
              All Thresholds Are Same:{' '}
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  bgcolor: areAllThresholdsSame() ? 'blue' : 'red',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: 1,
                }}
              >
                {areAllThresholdsSame() ? 'True' : 'False'}
              </Box>
            </>
          }
        />
      </CustomAccordion>
      <SubtitleBox subtitle="L2 Proposer Security Council">
        <ContentBox
          content="The Security Council A non-urgent upgrade can be made if 9 out of 12 signatures from the Security Council are obtained. The non-urgent upgrade begins on L2 and posts the transaction to L1 after a 3-day delay. Since there is a 1-day delay that forces the transaction to be included in the next state update, actions must be taken within 2 days to avoid the timelock. During the timelock periods on both L1 and L2, the Security Council can cancel the upgrade. After the 3-day timelock on L2, there is a challenge period of 6 days and 8 hours, followed by a 3-day L1 timelock. Once these periods have passed, the upgrade is confirmed. During the timelock periods on both L1 and L2, the Emergency Security Council can cancel the upgrade. perform upgrades when it secures 9 out of 12 signatures 
        from its members. Regular upgrades will incur a 12-day and 8-hour delay. However, in the case of a security threat, an emergency upgrade can be executed immediately without delay. Additionally, during the timelock period, the Security Council also holds the authority to cancel the upgrade."
        />
      </SubtitleBox>
      <SubtitleBox subtitle="L2 Emergency Security Council">
        <ContentBox
          content="The Smart Contract can be urgently upgraded without delay using the Upgrade Executor module, and it can take on the administrator role for all contracts within the system.
- **Upgrade Executor Module**:
    - It serves as the administrator for all contracts within the system.
    - It can perform upgrades without prior notice or delay.
    - It has unlimited upgrade authority, allowing it to upgrade transaction censorship, bridge implementations, and access all funds stored in the bridge or modify the sequencer or other system components."
        />
      </SubtitleBox>
    </BoxFrame>
  );
}
