import { context } from "near-sdk-as";
import { PersistentVector } from "near-sdk-core";

/**
 * membership status of each of the member in the community
 */
export enum Levels {
  beginner,
  intermediate,
  senior,
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

/**
 * Represents the member's object/interface
 */
@nearBindgen
class Member {
  id: i32;
  name: string;
  age: i32;
  level: Levels;
  gender: string;

  constructor(name: string, level: Levels, age: i32, gender: string, id: i32) {
    this.name = name;
    this.level = level;
    this.age = age;
    this.gender = gender;
    this.id = id;
  }
}

type Voter = {
  id: string;
};

@nearBindgen
class Issue {
  title: string;
  description: string;
  Upvote: i64;
  downVote: i64;
  voters: Voter[];

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
    this.Upvote = 0;
    this.downVote = 0;
    this.voters = [];
  }
}

@nearBindgen
class CommunityStruct {
  id: u64;
  name: string;
  description: string;
  teamLeader: string;
  members: PersistentVector<Member>;
  discussion: PersistentVector<Discuss>;
  issues: PersistentVector<Issue>;

  constructor(
    id: u64,
    name: string,
    description: string,
    teamLeader: string,
    members: PersistentVector<Member>,
    discussion: PersistentVector<Discuss>,
    issues: PersistentVector<Issue>
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.teamLeader = teamLeader;
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

  addIssues(title: string, description: string): string {
    assert(
      context.sender == this.teamLeader,
      "Only the team leader is eligible to call this function"
    );

    this.issues.push(new Issue(title, description));
    return "Update the community issues' board";
  }
}
