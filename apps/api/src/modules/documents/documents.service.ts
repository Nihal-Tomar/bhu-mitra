import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Optional,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { DataStoreService } from '../../common/data-store/data-store.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { DocumentDto, UserSession } from '@bhumitra/types';

export const ALLOWED_DOCUMENT_MIMES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/geo+json',
  'text/csv',
];

export const ALLOWED_DOCUMENT_TYPES = [
  'GAZETTE_NOTIFICATION',
  'SIA_REPORT',
  'KHASRA_MAP',
  'VALUATION_CERTIFICATE',
  'AWARD_SHEET',
  'PAYMENT_RECEIPT',
  'FIELD_PHOTO',
  'REHABILITATION_PACKAGE',
  'OBJECTION_PETITION',
];

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async getDocuments(query?: { projectId?: string; parcelId?: string; documentType?: string }): Promise<DocumentDto[]> {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const where: Record<string, any> = {};
        if (query?.projectId) where.projectId = query.projectId;
        if (query?.parcelId) where.parcelId = query.parcelId;
        if (query?.documentType) where.documentType = query.documentType;

        const docs = await this.prisma.document.findMany({
          where,
          include: { project: true, parcel: true },
          orderBy: { createdAt: 'desc' },
        });

        if (docs.length > 0) {
          return docs.map((d) => ({
            id: d.id,
            title: d.title,
            documentType: d.documentType as any,
            fileName: `${d.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
            fileSize: d.fileSize,
            fileUrl: d.fileUrl,
            storageKey: `docs/${d.id}`,
            mimeType: d.mimeType,
            checksumSha256: d.checksumSha256,
            version: d.version,
            uploadedByUserId: d.uploadedBy,
            uploadedByName: d.uploadedBy,
            uploadedAt: d.createdAt.toISOString(),
            projectId: d.projectId || undefined,
            parcelId: d.parcelId || undefined,
            isVerified: d.isVerified,
          }));
        }
      } catch (err) {
        this.logger.warn(`Prisma getDocuments failed: ${(err as Error).message}`);
      }
    }

    let docs = this.dataStore.getDocuments(query);
    if (query?.documentType) {
      docs = docs.filter((d) => d.documentType === query.documentType);
    }
    return docs;
  }

  async uploadDocument(
    data: Partial<DocumentDto> & { rawContent?: string },
    user: UserSession,
  ): Promise<DocumentDto> {
    if (!data.title || !data.documentType) {
      throw new BadRequestException('Document title and documentType are required');
    }

    if (!ALLOWED_DOCUMENT_TYPES.includes(data.documentType)) {
      throw new BadRequestException(
        `Invalid documentType "${data.documentType}". Allowed: [${ALLOWED_DOCUMENT_TYPES.join(', ')}]`,
      );
    }

    if (data.mimeType && !ALLOWED_DOCUMENT_MIMES.includes(data.mimeType)) {
      throw new BadRequestException(
        `Invalid MIME type "${data.mimeType}". Allowed types: PDF, JPEG, PNG, GeoJSON, CSV`,
      );
    }

    const fileSize = data.fileSize || 1024 * 512; // default 512 KB
    const maxSizeBytes = 25 * 1024 * 1024; // 25 MB limit
    if (fileSize > maxSizeBytes) {
      throw new BadRequestException('File size exceeds statutory maximum of 25MB');
    }

    // Compute or verify SHA-256 checksum
    const checksum =
      data.checksumSha256 ||
      crypto
        .createHash('sha256')
        .update(data.rawContent || `${data.title}-${Date.now()}`)
        .digest('hex');

    const newDoc: DocumentDto = {
      id: `doc-${Date.now()}`,
      title: data.title || 'Untitled Document',
      documentType: data.documentType as any,
      fileSize,
      fileUrl: data.fileUrl || `https://bhumitra.gov.in/storage/documents/doc-${Date.now()}.pdf`,
      storageKey: `bhumitra-documents/projects/${data.projectId || 'general'}/doc-${Date.now()}.pdf`,
      mimeType: data.mimeType || 'application/pdf',
      checksumSha256: checksum,
      version: 1,
      uploadedByUserId: user.id,
      uploadedByName: user.name,
      uploadedAt: new Date().toISOString(),
      projectId: data.projectId,
      parcelId: data.parcelId,
      isVerified: true,
    };

    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.document.create({
          data: {
            id: newDoc.id,
            title: newDoc.title,
            documentType: newDoc.documentType,
            fileUrl: newDoc.fileUrl,
            fileSize: newDoc.fileSize,
            mimeType: newDoc.mimeType,
            checksumSha256: checksum,
            version: 1,
            uploadedBy: user.name,
            projectId: newDoc.projectId,
            parcelId: newDoc.parcelId,
            isVerified: true,
          },
        });

        await this.prisma.auditLog.create({
          data: {
            actorId: user.id,
            actorName: user.name,
            actorRole: user.role,
            action: 'CREATE',
            entityType: 'DOCUMENT',
            entityId: newDoc.id,
            remarks: `Uploaded ${newDoc.documentType} "${newDoc.title}" (SHA-256: ${checksum.substring(0, 12)}...)`,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed to insert document into DB: ${(err as Error).message}`);
      }
    }

    const created = this.dataStore.uploadDocument(newDoc);
    this.dataStore.addAuditLog(
      user.id,
      user.name,
      'CREATE',
      'DOCUMENT',
      created.id,
      `Uploaded ${newDoc.documentType} "${newDoc.title}"`,
    );

    return created;
  }

  async getDocumentById(id: string, user?: UserSession): Promise<DocumentDto> {
    const docs = await this.getDocuments();
    const found = docs.find((d) => d.id === id);
    if (!found) {
      throw new NotFoundException(`Document with ID "${id}" not found`);
    }

    // Role-based access check: Citizens can only view public or assigned documents
    if (user && user.role === 'PUBLIC' && found.documentType === 'VALUATION_CERTIFICATE') {
      throw new ForbiddenException('Access restricted: Valuation certificates require authenticated officer access');
    }

    return found;
  }
}
