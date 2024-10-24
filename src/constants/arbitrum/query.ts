export const proposalQuery = `
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

export const titleQuery = `query Proposal($input: ProposalInput!) {
  proposal(input: $input) {
    metadata {
      title
    }
  }
}`;
