import { context } from "near-sdk-as";
import {
  CommunityStruct,
  IssueType,
  communities,
  Levels,
  Issue,
  AccountId,
} from "./model";
import { u128, RNG } from "near-sdk-as";

export function createCommunity(name: string, description: string): string {
  let uuid = new RNG<u64>(1, u64.MAX_VALUE);
  const id = "COM-" + uuid.next().toString();

  communities.set(id, new CommunityStruct(id, name, description));

  return "Created a new community with the name: " + name;
}

export function levelUp(communityID: string, memberID: AccountId): void {
  const DEPOSIT = context.attachedDeposit;
  const FIFTY_NEAR = u128.mul(
    u128.from(50),
    u128.from("1000000000000000000000000")
  );

  const HUNDREDTH_NEAR = u128.mul(
    u128.from(100),
    u128.from("1000000000000000000000000")
  );

  assert(DEPOSIT >= FIFTY_NEAR, "Oga add more money to this thing nah!!");

  const community = communities.get(communityID);

  if (community == null) return;
  else {
    for (let x = 0; x < community.members.length; x++) {
      if (community.members[x].id == memberID) {
        assert(
          community.members[x].level != Levels.senior,
          "Thank you sir for gifting us money. You can't be increased any further"
        );

        if (
          DEPOSIT >= FIFTY_NEAR &&
          community.members[x].level == Levels.beginner
        ) {
          community.members[x].level = Levels.intermediate;
        }

        if (
          DEPOSIT >= HUNDREDTH_NEAR &&
          community.members[x].level == Levels.intermediate
        ) {
          community.members[x].level = Levels.senior;
        }

        break;
      }
    }
  }
}

export function createIssue(
  communityID: string,
  issueType: IssueType,
  description: string
): void {
  const community = communities.get(communityID);
  assert(
    community != null,
    "This communnity doesn't exist yet. Do you mind creating it!"
  );

  if (community != null && community.teamLeader == context.sender) {
    let uuid = new RNG<u64>(1, u64.MAX_VALUE);
    const id = "COM-" + uuid.next().toString();

    community.issues.push(new Issue(id, issueType, description));
  }
}

export function VoteIssue(memberID: AccountId, id: string) {
  
}

function discussion(communityID: string): void {
  const community = communities.get(communityID);
}
