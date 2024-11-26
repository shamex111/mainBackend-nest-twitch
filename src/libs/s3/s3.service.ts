import {
  DeleteObjectCommand,
  type DeleteObjectCommandInput,
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getS3SelectelConfig } from 'src/config/s3-selectel.config';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;

  public constructor(private readonly configService: ConfigService) {
    this.client = new S3Client(getS3SelectelConfig(this.configService));

    this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
  }
  public async uploadFile(buffer: Buffer, key: string, mimetype: string) {
    const command: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    };

    try {
      await this.client.send(new PutObjectCommand(command));
    } catch (error) {
      throw error;
    }
  }

  public async deleteFile(key: string) {
    const command: DeleteObjectCommandInput = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      await this.client.send(new DeleteObjectCommand(command));
    } catch (error) {
      throw error;
    }
  }
}
