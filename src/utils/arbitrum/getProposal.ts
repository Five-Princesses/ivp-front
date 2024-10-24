import axios from 'axios';
import { apiUrls } from '../../constants/common/url';
import { proposalQuery, titleQuery } from '../../constants/arbitrum/query';
import { tallyGovernerId } from '../../constants/arbitrum/id';

const TALLY_API_KEY: string = import.meta.env.VITE_TALLY_API_KEY; // API 키

// Proposal 타입 정의
export interface Proposal {
  id: string;
  onchainId: string;
  status: string;
  createdAt: string;
  proposer: {
    id: string;
  };
}

// 첫 번째 쿼리: Proposals 목록을 가져오는 함수
export const getProposals = (): Promise<Proposal[]> => {
  const variables = {
    input: {
      filters: {
        governorId: tallyGovernerId,
        includeArchived: false,
        isDraft: false,
      },
      page: {
        afterCursor: null,
        beforeCursor: null,
        limit: 5,
      },
      sort: {
        isDescending: true,
        sortBy: 'id',
      },
    },
  };

  // Promise 체인 사용
  return axios
    .post(
      apiUrls.getTallyQueryUrl(),
      {
        query: proposalQuery,
        variables,
      },
      {
        headers: {
          'Api-Key': TALLY_API_KEY,
        },
      }
    )
    .then(response => {
      console.log('Fetched proposals:', response.data.data.proposals.nodes);
      return response.data.data.proposals.nodes;
    })
    .catch(error => {
      console.error('Error fetching proposals:', error);
      return [];
    });
};

// 두 번째 쿼리: Proposal의 Title을 가져오는 함수
export const getProposalTitle = (onchainId: string): Promise<string | null> => {
  const variables = {
    input: {
      onchainId,
      governorId: tallyGovernerId,
    },
  };

  console.log(`Fetching title for proposal with onchainId: ${onchainId}`);

  return axios
    .post(
      apiUrls.getTallyQueryUrl(),
      {
        query: titleQuery,
        variables,
      },
      {
        headers: {
          'Api-Key': TALLY_API_KEY,
        },
      }
    )
    .then(response => {
      // Object destructuring to satisfy the prefer-destructuring rule
      const {
        data: {
          data: {
            proposal: {
              metadata: { title },
            },
          },
        },
      } = response;

      console.log(`Fetched title for proposal ${onchainId}: ${title}`);
      return title;
    })
    .catch(error => {
      console.error(`Error fetching title for proposal ${onchainId}:`, error);
      return null;
    });
};
