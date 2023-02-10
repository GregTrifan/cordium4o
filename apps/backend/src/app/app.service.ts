import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {Cache} from "cache-manager"
import { credentials, Metadata } from '@grpc/grpc-js';
import crypto from 'crypto';
import {
  AttributesKeys,
  ConcordiumNodeClient,
  IdProofOutput,
  IdStatement,
  IdStatementBuilder,
} from '@concordium/node-sdk';
import { ChallengeStamp } from '../types/ProofingTypes';

@Injectable()
export class AppService {
  private readonly insecureCredentials = credentials.createInsecure();
  private client: ConcordiumNodeClient;
  private metadata: Metadata = new Metadata();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.metadata.add('authentication', 'rpcadmin');
    this.client = new ConcordiumNodeClient(
      'node.testnet.concordium.com',
      10000,
      this.insecureCredentials,
      this.metadata,
      1500
    );
  }

  // endpoint for fetching
  async getStatement(): Promise<IdStatement> {
    const statementBuilder = new IdStatementBuilder();

    // Specify that users must be part of the EU
    statementBuilder.addEUResidency();

    // Specify that users should reveal their nationality
    statementBuilder.revealAttribute(AttributesKeys.nationality);

    // Specify that users should be over 18
    statementBuilder.addMinimumAge(18);
    return statementBuilder.statements;
  }

  async getChallenge(address: string): Promise<string> {
    // generate string
    const rChallenge = await crypto.randomBytes(32).toString('hex');
    const challengeStamp: ChallengeStamp = {
      challenge: rChallenge,
      address,
      timeStamp: Date.now(),
    };
    // storing the whole thing on the Cache
    await this.cacheManager.set(rChallenge, challengeStamp,600);
    return challengeStamp.challenge;
  }

  async provideProof({
    challenge,
    proof,
  }: {
    challenge: string;
    proof: IdProofOutput;
  }): Promise<void> {


    const challengeStamp: ChallengeStamp | null = await this.cacheManager.get(challenge);

    if (challengeStamp)
    {
      // generate token or signature here, get rid of challenge if things are valid
    console.log(challenge, proof);
    }
    throw new Error("Provide proper challenge")
  }
}
