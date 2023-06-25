import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Airways backend')
    .setDescription('REST API documentation')
    .setVersion('0.0.1')
    .addTag('AirWays')
    .build();
  const documentation = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, documentation);

  await app.listen(PORT);
}
bootstrap();
