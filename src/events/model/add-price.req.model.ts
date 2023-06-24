import { ApiProperty } from '@nestjs/swagger';

export class AddPriceRequest {
  @ApiProperty({ example: '', description: '' })
  readonly date: string; // Дата и время

  @ApiProperty({ example: '', description: '' })
  readonly place: string; // Название места

  @ApiProperty({ example: '', description: '' })
  readonly address: string; // Адрес
}
