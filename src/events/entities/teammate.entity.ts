import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Teammate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  eventID: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  confirmed: boolean; // подтвердил ли пользователь участие в ивенте

  @Column({ nullable: false })
  paid: number; // сколько пользователь оплатил
}
