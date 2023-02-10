import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IdProofOutput, IdStatement } from '@concordium/node-sdk';
import { ProofDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get('/challenge/:address')
  getChallenge(@Param() params): Promise<string> {
    const address = params.address;
    return this.appService.getChallenge(address)
  }

  @Get('/statement')
  getStatement(): Promise<IdStatement> {
    return this.appService.getStatement();
  }

  @Post('/authenticate')
  provideProof(@Body() proofDto: ProofDto): Promise<void> {
   return this.appService.provideProof(proofDto);
  }
}
