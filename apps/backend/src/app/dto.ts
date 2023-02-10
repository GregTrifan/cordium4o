import { IdProofOutput } from "@concordium/node-sdk";

export type ProofDto = {
  challenge: string;
    proof: IdProofOutput;
}
