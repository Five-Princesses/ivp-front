import axios from 'axios';

const API_URL = 'https://api.tally.xyz/query'; // API 엔드포인트
const GOVERNOR_ID = 'eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9'; // governorId 값
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
  const query = `
    query Proposals($input: ProposalsInput!) {
      proposals(input: $input) {
        nodes {
          ... on Proposal {
            id
            onchainId
            status
            createdAt
            proposer {
              id
              name
            }
          }
        }
        pageInfo {
          firstCursor
          lastCursor
          count
        }
      }
    }
  `;

  const variables = {
    input: {
      filters: {
        governorId: GOVERNOR_ID,
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
      API_URL,
      {
        query,
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
  const query = `
    query Proposal($input: ProposalInput!) {
      proposal(input: $input) {
        metadata {
          title
        }
      }
    }
  `;

  const variables = {
    input: {
      onchainId,
      governorId: GOVERNOR_ID,
    },
  };

  console.log(`Fetching title for proposal with onchainId: ${onchainId}`);

  return axios
    .post(
      API_URL,
      {
        query,
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
