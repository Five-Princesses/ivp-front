export const BLOB_GRAPH_CONTENTS = {
  BATCH_SUBMITTER: `The batch submitter is used to post L2 transactions to L1 in batches.
          Arbitrum One generally uses blobs to save on gas costs, but if using
          blob data increases gas expenses, it automatically converts to
          calldata.`,
};

export const SECURITY_COUNCIL_CONTENTS = {
  SUMMARY: `The Security Council can perform upgrades when it secures 9 out of 12
          signatures from its members. Regular upgrades will incur a 12-day and
          8-hour delay. However, in the case of a security threat, an emergency
          upgrade can be executed immediately without delay. Additionally,
          during the timelock period, the Security Council also holds the
          authority to cancel the upgrade.`,
  PROCESS_SECURITY_COUNCIL: `In a typical upgrade process, discussions are initiated on the
          Arbitrum DAO forum, followed by a yes/no vote on Snapshot, and then an
          on-chain vote through Tally before the upgrade is implemented.
          However, for the Security Council, an upgrade can be executed without
          going through the voting process, provided it obtains signatures from
          at least 9 out of the 12 Security Council members. Upgrades are
          classified into two categories: proposer upgrades and emergency
          upgrades, and depending on the type, contracts are divided into the L2
          Proposer Security Council, L2 Emergency Security Council, and L1
          Security Council. Although their roles are differentiated, the same
          Security Council members must constitute each of the contracts.`,
  PROPOSER_UPGRADE: `All upgrades begin on Layer 2 (L2). A proposer upgrade is initiated by
          the L2 Proposer Security Council, and after passing through a 3-day L2
          Timelock, it moves to the outbox. If there is disagreement with the
          upgrade, users have a 2-day window to exit L2 during the 3-day L2
          Timelock period, excluding the one-day delay for forcibly executing a
          transaction on Layer 1 (L1). <br />
          <br />A 6-day and 8-hour challenge period occurs, and if no issues
          arise, the upgrade is sent to the L1 Timelock, where there is an
          additional 3-day delay. During the 3-day L2 Timelock period, the L2
          Emergency Security Council has the authority to cancel the upgrade,
          and during the 3-day L1 Timelock period, the L1 Security Council has
          the authority to cancel the upgrade. <br /> <br />
          After the L1 Timelock period, the upgrade is sent back to L2 via the
          inbox, where all L2 system contracts are upgraded through the L2
          Upgrade Executor. Simultaneously, all L1 system contracts are upgraded
          using the Upgrade Executor module on L1.`,
  EMERGENCY_UPGRADE: `In the case of an emergency upgrade, when a security threat is
          detected, swift action is required, so a long upgrade process like the
          proposer upgrade is not suitable. Therefore, the L2 Emergency Security
          Council immediately executes the L2 Upgrade Executor to upgrade all
          system contracts on Layer 2 (L2). Simultaneously, the L1 Emergency
          Security Council executes the Upgrade Executor to upgrade all system
          contracts on Layer 1 (L1). After the emergency upgrade is carried out,
          the Emergency Security Council is required to submit a transparency
          report regarding the upgrade.`,
};
