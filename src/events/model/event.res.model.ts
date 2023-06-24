import { ApiProperty } from '@nestjs/swagger';
import { ExpenditureItem } from '../entities/expenditure-item.entity';
import { TeammateRes } from './teammate.res';

export class EventResponce {
  @ApiProperty({ example: '', description: '' })
  readonly id: number; // ID события

  @ApiProperty({ example: '', description: '' })
  readonly date: string; // Дата и время

  @ApiProperty({ example: '', description: '' })
  readonly place: string; // Название места

  @ApiProperty({ example: '', description: '' })
  readonly address: string; // Адрес

  @ApiProperty({ description: '' })
  readonly expenditure: ExpenditureItem[]; // Список расходов

  @ApiProperty({ example: '', description: '' })
  readonly price: number; // общая цена за все

  @ApiProperty({ example: '', description: '' })
  readonly priceForPersone: number; // цена за 1 человека

  @ApiProperty({ description: '' })
  readonly team: TeammateRes[]; // Комманда
}
