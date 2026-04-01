import { ApiProperty } from '@nestjs/swagger'

import { NodeType } from '@generated/prisma/enums'

export class NodeWithDepthResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty({ enum: NodeType })
  type: NodeType

  @ApiProperty()
  depth: number
}
