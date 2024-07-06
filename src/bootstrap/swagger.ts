import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Universal Pet API')
    .setDescription('The Universal Pet API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
  });
}
