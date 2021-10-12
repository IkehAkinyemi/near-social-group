import { context } from "near-sdk-as";
import { PersistentVector, RNG } from "near-sdk-core";

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

type Discuss = {
  id: u32;
  section: Section;
  description: string;
  ownerID: string;
};


@nearBindgen
class Member {
  id: i32;
  name: string;
  age: i32;
  level: Levels;
  gender: string;

  constructor(name: string, age: i32, gender: string, id: i32) {
    this.name = name;
    this.level = Levels.beginner;
    this.age = age;
    this.gender = gender;
    this.id = id;
  }
}

type Voter = {
  id: string;
};

export enum IssueType {
  COMPLAINT,
  ELECTION,
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
  id: u64;
  name: string;
  description: string;
  teamLeader: string;
  members: PersistentVector<Member>;
  discussion: PersistentVector<Discuss>;
  issues: PersistentVector<Issue>;

  constructor(name: string, description: string) {
    let uuid = new RNG<u64>(1, u64.MAX_VALUE);

    this.id = uuid.next();
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
    id: i32
  ): string {
    assert(
      context.sender == this.teamLeader,
      "Only the team leader is eligible to call this function"
    );

    for (let x = 0; x > this.members.length; x++) {
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

  removeMember(id: i32): void {
    assert(
      context.sender == this.teamLeader,
      "Only the team leader is eligible to call this function"
    );

    for (let x = 0; x > this.members.length; x++) {
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
