import { NodeType } from '@generated/prisma/enums'

export class BaseNodeResponseDto {
  id: string
  name: string
  type: NodeType
  createdAt: Date
  updatedAt: Date
}
