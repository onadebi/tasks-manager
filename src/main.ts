import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { appsettings } from './config/appsettings.config';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe());

  const swaggerOptions = new DocumentBuilder().setTitle(appsettings.AppName)
  .setDescription(`The ${appsettings.AppName} API description`)
  .setVersion(appsettings.AppVersion)
  .build();
  const document = SwaggerModule.createDocument(app,swaggerOptions);
  SwaggerModule.setup('/api-docs',app,document);

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000);
}
bootstrap();
