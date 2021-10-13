import { context } from "near-sdk-as";
import { CommunityStruct, IssueType, communities } from "./model";
import { u128, RNG } from "near-sdk-as";

export function createCommunity(name: string, description: string): string {
  let uuid = new RNG<u64>(1, u64.MAX_VALUE);
 const id = "COM-"+uuid.next().toString();

  communities.set(
    id,
    new CommunityStruct(id,name, description)
  );

  return "Created a new community with the name: " + name;
}

export function levelUp(id: string): void {
  const DEPOSIT = context.attachedDeposit;
  const FIFTY_NEAR = u128.mul(u128.from(50), u128.from("1000000000000000000000000"));
  assert(DEPOSIT >= FIFTY_NEAR, "Oga add more money to this thing nah!!");

  const community = communities.get(id);
  assert(community?.members.cont)

}

export function createIssue(issueType: IssueType, description: string): void {
 
}