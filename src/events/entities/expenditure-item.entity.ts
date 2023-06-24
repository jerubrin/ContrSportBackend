import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExpenditureItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  eventID: number;

  @Column({ nullable: false })
  name: string; // Название статьи расходов

  @Column({ nullable: false })
  price: number; // Цена (сделаем все в 1 валюте, будем считать, что в тг)
}
