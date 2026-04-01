import { ApiProperty } from '@nestjs/swagger'

import { NodeType } from '@generated/prisma/enums'

export class BaseNodeResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty({ enum: NodeType })
  type: NodeType

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
