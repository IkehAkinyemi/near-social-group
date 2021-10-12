import { context } from "near-sdk-as";
import { CommunityStruct, IssueType } from "./model";
import { storage, u128 } from "near-sdk-as";

export function createCommunity(name: string, description: string): string {
  storage.set<CommunityStruct>(
    name,
    new CommunityStruct(name, description)
  );

  return "Created a new community with the name: " + name;
}

export function levelUp(): void {
  const DEPOSIT = context.attachedDeposit;
  const FIFTY_NEAR = u128.mul(u128.from(50), u128.from("1000000000000000000000000"));

  assert(DEPOSIT >= FIFTY_NEAR, "Oga add more money to this thing nah!!");
}

export function createIssue(issueType: IssueType, description: string): void {
 
}