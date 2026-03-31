import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsUUID()
  @IsOptional()
  parentId?: string
}
