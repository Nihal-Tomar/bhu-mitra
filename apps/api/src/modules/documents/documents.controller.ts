import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { DocumentDto, UserSession } from '@bhumitra/types';

@ApiTags('Documents')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'List statutory documents with optional project/parcel filter' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'parcelId', required: false })
  @ApiQuery({ name: 'documentType', required: false })
  async getDocuments(
    @Query('projectId') projectId?: string,
    @Query('parcelId') parcelId?: string,
    @Query('documentType') documentType?: string,
  ) {
    const items = await this.documentsService.getDocuments({ projectId, parcelId, documentType });
    return { data: items };
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a statutory document with versioning and SHA256 checksum' })
  async uploadDocument(@Body() data: Partial<DocumentDto>, @CurrentUser() user: UserSession) {
    const doc = await this.documentsService.uploadDocument(data, user);
    return { data: doc };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document metadata by ID' })
  async getDocument(@Param('id') id: string, @CurrentUser() user: UserSession) {
    const doc = await this.documentsService.getDocumentById(id, user);
    return { data: doc };
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get secure pre-signed download URL for document' })
  async getDownloadUrl(@Param('id') id: string, @CurrentUser() user: UserSession) {
    const doc = await this.documentsService.getDocumentById(id, user);
    return {
      data: {
        id: doc.id,
        title: doc.title,
        downloadUrl: doc.fileUrl,
        checksumSha256: doc.checksumSha256,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
    };
  }
}
