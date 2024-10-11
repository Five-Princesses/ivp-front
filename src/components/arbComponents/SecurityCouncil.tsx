/*
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
  getSecurityCouncilL1LatestTxHash1,
  getSecurityCouncilL1LatestTxHash2,
  getSecurityCouncilL1LatestTxHash3,
  getSecurityCouncilL2LatestTxHash1,
  getSecurityCouncilL2LatestTxHash2,
  getSecurityCouncilL2LatestTxHash3,
  getSecurityCouncilL2LatestTxHash4,
  getSecurityCouncilL2LatestTxHash5,
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

  const [l1TransactionHashes, setL1TransactionHashes] = useState<string[]>([]);
  const [l2TransactionHashes, setL2TransactionHashes] = useState<string[]>([]); // L2 Security Council 상태 추가
  const [l2ProposeTransactionHashes, setL2ProposeTransactionHashes] = useState<
    string[]
  >([]);

  // 배열을 주어진 크기로 나누는 함수
  function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
  async function fetchL1TransactionHashes(
    membersData: string[]
  ): Promise<string[]> {
    const l1TransactionHashes: string[] = [];
    const chunks = chunkArray(membersData, 5); // 멤버 데이터를 5개씩 그룹으로 나누기

    // L1 함수 배열 정의
    const l1Functions = [
      getSecurityCouncilL1LatestTxHash1,
      getSecurityCouncilL1LatestTxHash2,
      getSecurityCouncilL1LatestTxHash3,
    ];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const l1Function = l1Functions[i % l1Functions.length]; // 함수들을 순환적으로 사용

      let txHashes = [];
      let attempts = 0;
      const maxAttempts = 10;

      // 최대 10번까지 재시도 시도
      while (attempts < maxAttempts && txHashes.length === 0) {
        try {
          txHashes = await l1Function(chunk);
        } catch (error) {
          console.error(
            `Error fetching L1 transaction hash for chunk ${chunk}:`,
            error
          );
        }
        attempts++;
      }

      txHashes.forEach(txHash =>
        l1TransactionHashes.push(txHash || 'No Transaction')
      );
    }

    return l1TransactionHashes;
  }

  async function fetchL2TransactionHashes(
    membersData: string[]
  ): Promise<string[]> {
    const l2TransactionHashes: string[] = [];
    const chunks = chunkArray(membersData, 5);
    console.log('chunks', chunks); // 멤버 데이터를 5개씩 그룹으로 나누기

    // L2 함수 배열 정의
    const l2Functions = [
      getSecurityCouncilL2LatestTxHash1,
      getSecurityCouncilL2LatestTxHash2,
      getSecurityCouncilL2LatestTxHash3,
      getSecurityCouncilL2LatestTxHash4,
      getSecurityCouncilL2LatestTxHash5,
    ];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const l2Function = l2Functions[i % l2Functions.length];

      let txHashes = [];
      let attempts = 0;
      const maxAttempts = 10;

      // 최대 3번까지 재시도 시도
      while (attempts < maxAttempts && txHashes.length === 0) {
        try {
          txHashes = txHashes.concat(await l2Function(chunk));
        } catch (error) {
          console.error(
            `Error fetching L2 transaction hash for chunk ${chunk}:`,
            error
          );
        }
        attempts++;
        console.log('try', attempts);
      }

      txHashes.forEach(txHash =>
        l2TransactionHashes.push(txHash || 'No Transaction')
      );
    }

    return l2TransactionHashes;
  }

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

      // L1, L2, L2 Propose 트랜잭션 해시 가져오기
      const l1TransactionHashes = await fetchL1TransactionHashes(l1MembersData);
      const l2TransactionHashes = await fetchL2TransactionHashes(l2MembersData);
      const l2ProposeTransactionHashes =
        await fetchL2TransactionHashes(l2ProposeMembersData);

      setL1TransactionHashes(l1TransactionHashes);
      setL2TransactionHashes(l2TransactionHashes);
      setL2ProposeTransactionHashes(l2ProposeTransactionHashes);

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
                    bgcolor: 'lightgray',
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
                    bgcolor: 'lightgray',
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
                    bgcolor: 'lightgray',
                    color: 'black',
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
                            bgcolor: 'lightgray',
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
                            bgcolor: 'lightgray',
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
                            bgcolor: 'lightgray',
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

  const renderTableTrue = () => {
    const totalMembers = Math.max(l1Members.length, l2Members.length);

    return (
      <TableContainer component={Paper}>
        <Table sx={{ borderCollapse: 'collapse' }}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(totalMembers)].map((_, index) => {
              const l1Member = l1Members[index];
              const l1TransactionHash = l1TransactionHashes[index];
              const l2Member = l2Members[index];
              const l2TransactionHash = l2TransactionHashes[index];

              return (
                <TableRow key={`${l1Member || ''}-${l2Member || ''}`}>
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
                        {l1TransactionHash ? (
                          <Box
                            sx={{
                              fontSize: '12px',
                              color: 'gray',
                              marginTop: '4px',
                            }}
                          >
                            Latest Tx:{' '}
                            <Link
                              href={`https://etherscan.io/tx/${l1TransactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                            >
                              {l1TransactionHash}
                            </Link>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              fontSize: '12px',
                              color: 'red',
                              marginTop: '4px',
                            }}
                          >
                            No Transaction
                          </Box>
                        )}
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
                        {l2TransactionHash ? (
                          <Box
                            sx={{
                              fontSize: '12px',
                              color: 'gray',
                              marginTop: '4px',
                            }}
                          >
                            Latest Tx:{' '}
                            <Link
                              href={`https://arbiscan.io/tx/${l2TransactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                            >
                              {l2TransactionHash}
                            </Link>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              fontSize: '12px',
                              color: 'red',
                              marginTop: '4px',
                            }}
                          >
                            No Transaction
                          </Box>
                        )}
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

  const renderTableFalse = () => {
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
          </TableHead>
          <TableBody>
            {[...Array(totalMembers)].map((_, index) => {
              const l1Member = l1Members[index];
              const l1TransactionHash = l1TransactionHashes[index];
              const l2Member = l2Members[index];
              const l2TransactionHash = l2TransactionHashes[index];
              const l2ProposeMember = l2ProposeMembers[index];
              const l2ProposeTransactionHash =
                l2ProposeTransactionHashes[index];

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
                        {l1TransactionHash ? (
                          <Box
                            sx={{
                              fontSize: '12px',
                              color: 'gray',
                              marginTop: '4px',
                            }}
                          >
                            Latest Tx: {l1TransactionHash}
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              fontSize: '12px',
                              color: 'red',
                              marginTop: '4px',
                            }}
                          >
                            No Transaction
                          </Box>
                        )}
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
                        {l2TransactionHash ? (
                          <Box
                            sx={{
                              fontSize: '12px',
                              color: 'gray',
                              marginTop: '4px',
                            }}
                          >
                            Latest Tx:{' '}
                            <Link
                              href={`https://arbiscan.io/tx/${l2TransactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                            >
                              {l2TransactionHash}
                            </Link>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              fontSize: '12px',
                              color: 'red',
                              marginTop: '4px',
                            }}
                          >
                            No Transaction
                          </Box>
                        )}
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
                        {l2ProposeTransactionHash ? (
                          <Box
                            sx={{
                              fontSize: '12px',
                              color: 'gray',
                              marginTop: '4px',
                            }}
                          >
                            Latest Tx:{' '}
                            <Link
                              href={`https://arbiscan.io/tx/${l2ProposeTransactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                            >
                              {l2ProposeTransactionHash}
                            </Link>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              fontSize: '12px',
                              color: 'red',
                              marginTop: '4px',
                            }}
                          >
                            No Transaction
                          </Box>
                        )}
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
        {areAllMembersSame() ? (
          <>
            <ContentBox content="Security Council's latest transaction hash" />
            {renderTableTrue()}
          </>
        ) : (
          <>
            <ContentBox content="Security Council's latest transaction hash(members are diffrent)" />
            {renderTableFalse()}
          </>
        )}
      </CustomAccordion>
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

*/
