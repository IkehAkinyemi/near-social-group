import { context } from "near-sdk-as";
import { PersistentMap, PersistentVector, RNG } from "near-sdk-core";

/**
 * membership status of each of the member in the community
 */
export enum Levels {
  beginner,
  intermediate = 50,
  senior = 100,
}

export enum Section {
  MOBILE,
  DEVOP,
  WEB,
}

export enum IssueType {
  COMPLAINT,
  ELECTION,
}

type Discuss = {
  id: u32;
  section: Section;
  description: string;
  ownerID: string;
};

type AccountId = string;

type Voter = {
  id: string;
};

@nearBindgen
class Member {
  name: AccountId;
  age: i32;
  level: Levels;
  gender: string;

  constructor(name: AccountId, age: i32, gender: string, public id: string) {
    this.name = name;
    this.level = Levels.beginner;
    this.age = age;
    this.gender = gender;
  }
}

@nearBindgen
class Issue {
  description: string;
  Upvote: i64;
  downVote: i64;
  voters: Voter[];

  constructor(public type: IssueType, description: string) {
    this.description = description;
    this.Upvote = 0;
    this.downVote = 0;
    this.voters = [];
  }
}

@nearBindgen
export class CommunityStruct {
  name: string;
  description: string;
  teamLeader: string;
  members: PersistentVector<Member>;
  discussion: PersistentVector<Discuss>;
  issues: PersistentVector<Issue>;

  constructor(public id: string, name: string, description: string) {
    this.name = name;
    this.description = description;
    this.teamLeader = context.sender;
    this.members = new PersistentVector<Member>("member");
    this.discussion = new PersistentVector<Discuss>("discuss");
    this.issues = new PersistentVector<Issue>("issues");
  }

  addMember(
    name: string,
    level: Levels,
    age: i32,
    gender: string,
  ): string {
    const roll = new RNG<u32>(1, u32.MAX_VALUE);
    const id = "Com-" + roll.next().toString();

    assert(
      context.sender == this.teamLeader,
      "Only the team leader is eligible to call this function"
    );

    for (let x = 0; x < this.members.length; x++) {
      assert(
        this.members[x].id != id,
        "This unique ID exists in the community"
      );
    }

    this.members.push({
      id,
      name,
      level,
      age,
      gender,
    });

    return "Added a new member to the community";
  }

  removeMember(id: string): void {
    assert(
      context.sender == this.teamLeader,
      "Only the team leader is eligible to call this function"
    );

    for (let x = 0; x < this.members.length; x++) {
      if (this.members[x].id == id) {
        this.members.swap_remove(x);
      }
    }
  }

  switchTeamLeader(newLeader: string): void {
    assert(
      this.teamLeader == context.sender,
      "The current team leader would handle over the leadership"
    );
    this.teamLeader = newLeader;
  }
}

export const communities = new PersistentMap<string, CommunityStruct>("community");