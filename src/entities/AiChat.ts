import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ai_chat')
export class AiChat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column()
  email: string;

  @Column()
  type: string; // by default 'chat' otherwise 'html'

  @Column()
  message: string;

  @Column({ type: 'enum', enum: ['user', 'ai'] })
  sender: 'user' | 'ai';

  @Column({ nullable: true })
  ip_address: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  viewed: boolean;

  @Column({ nullable: true })
  uuid: string;
}
