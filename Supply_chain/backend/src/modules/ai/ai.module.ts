import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiHistory, AiHistorySchema } from './schemas/ai-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AiHistory.name, schema: AiHistorySchema }])
  ],
  controllers: [AiController],
  providers: [AiService]
})
export class AiModule {}
