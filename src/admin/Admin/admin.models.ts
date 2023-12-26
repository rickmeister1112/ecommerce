import { Field, ID, InputType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserAdmin {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ type: 'text' })
  password_hash: string;

  @Column({ type: 'text'})
  email: string;

  @Column({ type: 'text' })
  first_name: string;

  @Column({ type: 'text', default: '' })
  last_name: string;

  @Column({ type: 'integer', default: 0 })
  is_admin: number;

  @Column({ type: 'integer', default: 0 })
  is_active: number;

  @Column({ type: 'text', default: '', unique: true })
  mobile: string;
}

export interface UserAdminInput {
  password_hash: string;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: number;
  is_active: number;
  mobile: string;
}


@Entity()
export class Role {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ type: 'text' , default : '' })
  role_name: string;
}

export interface RoleInput {
  role_name: string;
}


@Entity()
export class UserRole {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => UserAdmin, user => user.id)
  user: UserAdmin;

  @ManyToOne(() => Role, role => role.id)
  role: Role;
}

@InputType()
export class UserRoleInput {
  @Field(type => ID)
  user_id: string;

  @Field(type => [ID])
  role_id: string;
}