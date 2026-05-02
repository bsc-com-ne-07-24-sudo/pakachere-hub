import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global() // This makes the database available to all other modules automatically
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService], // This "publishes" the service for others to use
})
export class DatabaseModule {}