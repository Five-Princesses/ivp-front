import { Box, Grid, Typography } from '@mui/material';
import BoxFrame from '../../common/BoxFrame';
import SubtitleBox from '../../common/SubtitleBox';
import ContentBox from '../../common/ContentBox';
import CustomAccordion from '../../common/CustomAccordion';
import { ComponentStatus } from './types';
import StatusCard from './StatusCard';

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

function ArbitrumStatus() {
  // const [item, setItem] = React.useState('status');

  // useEffect(() => {
  //   getArbitrumStatus();
  // }, []);
  const dummyData = {
    components: [
      {
        id: '1',
        name: 'Sequencer',
        description: 'ARB1 - Sequencer',
        status: ComponentStatus.OPERATIONAL,
      },
      {
        id: '2',
        name: 'Batch Poster',
        description: 'ARB1 - Batch Poster',
        status: ComponentStatus.PARTIALOUTAGE,
      },
      {
        id: '3',
        name: 'Validator',
        description: 'ARB1 - Validator',
        status: ComponentStatus.MINOROUTAGE,
      },
      {
        id: '4',
        name: 'feed',
        description: 'ARB1 - Feed',
        status: ComponentStatus.MAJOROUTAGE,
      },
      {
        id: '5',
        name: 'arbiscan',
        description: 'ARB1 - Arbiscan',
        status: ComponentStatus.MAJOROUTAGE,
      },
    ],
  };

  // const getArbitrumStatus = () => {
  //   const status = axios.get('https://status.arbitrum.io/v2/components.json');

  //   console.log(status);
  // };

  return (
    <BoxFrame title="Status">
      <SubtitleBox subtitle="Health">
        <ContentBox content="This dashboard shows the current status of the Arbitrum sequencer and its components. Each component is monitored for operational health, and any issues are highlighted here for further inspection." />
      </SubtitleBox>

      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {dummyData.components.map(component => (
          <Grid item key={component.id} xs={2}>
            <StatusCard
              title={component.name}
              value={component.status}
              description={component.description}
              status={component.status}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ marginTop: '24px' }}>
        {dummyData.components.map(component => (
          <CustomAccordion
            key={component.id}
            title={component.name}
            content={component.description}
            onChange={(event, isExpanded) =>
              console.log(`${component.name} expanded: ${isExpanded}`)
            }
            loading={false}
          >
            <Box>
              <Typography variant="body2">
                Current Status:{' '}
                <span style={{ color: getStatusColor(component.status) }}>
                  {component.status}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ marginTop: '8px' }}>
                {component.description}
              </Typography>
            </Box>
          </CustomAccordion>
        ))}
      </Box>
    </BoxFrame>
  );
}

export default ArbitrumStatus;
