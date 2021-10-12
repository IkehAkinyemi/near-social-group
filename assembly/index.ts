import { context } from "near-sdk-as";
import { CommunityStruct, IssueType } from "./model";
import { storage } from "near-sdk-as";

export function createCommunity(name: string, description: string): string {
  storage.set<CommunityStruct>(
    name,
    new CommunityStruct(name, description)
  );

  return "Created a new community with the name: " + name;
}

export function levelUp(): void {
  
}

export function createIssue(issueType: IssueType, description: string): void {
 
}