import { Injectable } from '@nestjs/common';
import { credentials, Metadata } from '@grpc/grpc-js';
import {
  AccountAddress,
  AccountInfo,
  AttributesKeys,
  ConcordiumNodeClient,
  getIdProof,
  IdStatementBuilder,
} from '@concordium/node-sdk';

@Injectable()
export class AppService {
  private readonly insecureCredentials = credentials.createInsecure();
  private client: ConcordiumNodeClient;
  private metadata: Metadata = new Metadata();

  constructor() {
    this.metadata.add('authentication', 'rpcadmin');
    this.client = new ConcordiumNodeClient(
      'node.testnet.concordium.com',
      10000,
      this.insecureCredentials,
      this.metadata,
      1500
    );
  }

  async getSampleCountry(): Promise<string> {
    const accountAddress = new AccountAddress(
      '48HEZQ7wZU2S1fenyQzt9Ms5K3R4yMHyUtwUqkoREHsFW7zcHb'
    );
    const blockHash =
      '60d3b378379673171dac9ce242db5caece4bc424eff4706b98920a3a3e5c9554';
    const accountInfo: AccountInfo = await this.client.getAccountInfo(
      accountAddress,
      blockHash
    );

    // Nationality for the account creator, if the information has been revealed.
    const nationality: string =
      accountInfo.accountCredentials[0].value.contents.policy
        .revealedAttributes['nationality'];

    return nationality;
  }
  async getStatement(): Promise<IdStatementBuilder> {
    const statementBuilder = new IdStatementBuilder();

    // Specify that users must be part of the EU
    statementBuilder.addEUResidency();

    // Specify that users should reveal their nationality
    statementBuilder.revealAttribute(AttributesKeys.nationality);

    // Specify that users should be over 18
    statementBuilder.addMinimumAge(18);
    return statementBuilder;
  }
}
