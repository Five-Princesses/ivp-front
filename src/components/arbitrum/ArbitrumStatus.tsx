import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Skeleton } from '@mui/material';
import axios from 'axios';
import BoxFrame from '../common/BoxFrame';
import SubtitleBox from '../common/SubtitleBox';
import ContentBox from '../common/ContentBox';
import CustomAccordion from '../common/CustomAccordion';
import {
  ComponentStatus,
  IArbitrumStatus,
  IComponent,
} from '../../utils/common/types';
import StatusCard from './status/StatusCard';
import { statusARB1GroupId } from '../../constants/arbitrum/id';

// 컴포넌트 상태에 따른 색상을 반환하는 함수
const getStatusColor = (status: ComponentStatus) => {
  switch (status) {
    case ComponentStatus.OPERATIONAL:
      return 'green';
    case ComponentStatus.PARTIALOUTAGE:
      return 'orange';
    case ComponentStatus.MINOROUTAGE:
      return 'yellow';
    case ComponentStatus.MAJOROUTAGE:
      return 'red';
    default:
      return 'gray';
  }
};
const statusMap: { [key: string]: ComponentStatus } = {
  OPERATIONAL: ComponentStatus.OPERATIONAL,
  PARTIALOUTAGE: ComponentStatus.PARTIALOUTAGE,
  MINOROUTAGE: ComponentStatus.MINOROUTAGE,
  MAJOROUTAGE: ComponentStatus.MAJOROUTAGE,
};

const convertStringToEnum = (value: string): ComponentStatus => {
  const status = statusMap[value];
  if (status !== undefined) {
    return status;
  }
  throw new Error(`Invalid status value: ${value}`);
};

function ArbitrumStatus() {
  const [status, setStatus] = useState<IArbitrumStatus | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가

  // Arbitrum 상태 정보를 가져오는 함수
  const getArbitrumStatus = async (): Promise<IArbitrumStatus> => {
    try {
      const response = await axios.get<IArbitrumStatus>(
        'https://status.arbitrum.io/v2/components.json'
      );
      return response.data;
    } catch (e) {
      console.error('Failed to fetch Arbitrum status:', e);
      return {
        components: [],
      };
    }
  };

  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    // skeleton 적용 테스트를 위해 setTimeout 추가
    // setTimeout(() => {
    getArbitrumStatus()
      .then(data => {
        const filteredData: IArbitrumStatus = {
          ...data,
          components: data.components
            .filter(
              (component: IComponent) =>
                component.group?.id === statusARB1GroupId // ARB1 Group ID
            )
            .map((component: IComponent) => ({
              ...component,
              status: convertStringToEnum(component.status),
            })),
        };
        setStatus(filteredData);
        setLoading(false); // 데이터 로드 완료 후 로딩 해제
      })
      .catch(error => {
        console.error('Failed to fetch Arbitrum status:', error);
        setLoading(false);
      });
    // }, 100000);
  }, []);

  return (
    <BoxFrame title="Status">
      {/* 제목 및 설명 */}
      <SubtitleBox subtitle="Health">
        <ContentBox content="">
          This dashboard shows the current status of the Arbitrum sequencer and
          its components. Each component is monitored for operational health,
          and any issues are highlighted here for further inspection.
        </ContentBox>
      </SubtitleBox>

      {/* 컴포넌트 상태 카드 렌더링 */}
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {loading
          ? // 데이터 로드 중일 때 Skeleton 표시 (고유 key 생성)
            Array.from(new Array(5)).map(() => (
              <Grid item key={crypto.randomUUID()} xs={2}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={150}
                  sx={{ borderRadius: '12px' }}
                />
              </Grid>
            ))
          : // 데이터 로드가 완료되면 StatusCard 렌더링
            status?.components.map(component => (
              <Grid item key={component.id} xs={2}>
                <StatusCard
                  title={component.name}
                  value={component.status}
                  description=""
                  status={component.status}
                />
              </Grid>
            ))}
      </Grid>

      {/* 컴포넌트 상세 설명 아코디언 */}
      <Box sx={{ marginTop: '24px' }}>
        {loading
          ? // 데이터 로드 중일 때 Skeleton 표시 (고유 key 생성)
            Array.from(new Array(5)).map(() => (
              <CustomAccordion
                key={crypto.randomUUID()}
                title={<Skeleton sx={{ minWidth: '200px', width: '80%' }} />}
                content={
                  <Skeleton
                    style={{
                      minWidth: '50px',
                      width: '100%',
                      height: '50px',
                    }}
                  />
                }
                onChange={() => {}}
                loading
              >
                <Box>
                  <Skeleton
                    width="100%"
                    height="20px"
                    sx={{ marginBottom: '8px', minWidth: '50px' }}
                  />
                  <Skeleton
                    style={{ minWidth: '50px', width: '100%', height: '20px' }}
                  />
                </Box>
              </CustomAccordion>
            ))
          : // 데이터 로드가 완료되면 아코디언 렌더링
            status?.components.map(component => (
              <CustomAccordion
                key={component.id}
                title={component.name}
                content={component.description}
                onChange={() => {}}
                loading={false}
              >
                <Box>
                  <Typography variant="body2">
                    Current Status:{' '}
                    <span style={{ color: getStatusColor(component.status) }}>
                      {component.status}
                    </span>
                  </Typography>
                </Box>
              </CustomAccordion>
            ))}
      </Box>
    </BoxFrame>
  );
}

export default ArbitrumStatus;
