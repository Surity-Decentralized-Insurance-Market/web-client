export type RGBColor = [number, number, number];

interface Marketer {
  name?: string;
  image?: string;
  policiesCreated?: [string];
}

export interface User {
  address: string;
  name?: string;
  image?: string;
  marketer?: Marketer;
}

export interface Policy {
  _id: string;
  address: string;
  cid: string;
  rating?: number;
  tags?: string[];
  name: string;
  description: string;
  category: string;
  minimumClaim: string;
  maximumClaim: string;
  premiumFunc: string;
  premiumFuncDescription: string;
  claimFunc: string;
  claimFuncDescription: string;
  minimumDuration: string;
  maximumDuration: string;
  creator: string;
  stakeToken: string;
  policyHolders?: string[];
  policyStakers?: string[];
  __v: number;
}
