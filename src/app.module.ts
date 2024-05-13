import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import configuration from './envs/configuration';
import { HandlersModule } from './handlers/handlers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true, // enable expand variables in ".env" file
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DATABASE_CONFIG').mongodb.uri,
        onConnectionCreate: (connection) => {
          connection.on('connected', () => {
            console.log(
              ':::::::::::: Connected to database successfullly ::::::::::::',
            );
          });

          connection.on('error', (error) => {
            console.error('Error connecting to database', error);
          });
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    HandlersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
