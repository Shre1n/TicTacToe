import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ description: 'file', type: 'string', format: 'binary' })
  avatar: any;

  @ApiProperty({ description: 'file title', example: 'my nice avatar' })
  title: string;
}
