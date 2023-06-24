import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ExpenditureItem } from './expenditure-item.entity';
import { Teammate } from './teammate.entity';

@Entity()
export class Event {
  // Итем спортивной собирушки
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  date: string; // Дата и время

  @Column({ nullable: false })
  place: string; // Название места

  @Column({ nullable: false })
  address: string; // Адрес
}
