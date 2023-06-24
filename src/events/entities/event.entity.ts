import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ExpenditureItem } from './expenditure-item.entity';

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

  @Column({ nullable: false })
  expenditure: ExpenditureItem[]; // Список расходов

  @Column({ nullable: false })
  team: Teammate[]; // Комманда
}
