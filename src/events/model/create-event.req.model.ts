import { ApiProperty } from '@nestjs/swagger';
import { ExpenditureItem } from '../entities/expenditure-item.entity';

export class CreateEventRequest {
  @ApiProperty({ example: '', description: '' })
  readonly date: string; // Дата и время

  @ApiProperty({ example: '', description: '' })
  readonly place: string; // Название места

  @ApiProperty({ example: '', description: '' })
  readonly address: string; // Адрес

  @ApiProperty({ description: '' })
  expenditure: Omit<ExpenditureItem, "id">[]; // Список расходов

  @ApiProperty({ description: '' })
  team: string[]; // Комманда
}
