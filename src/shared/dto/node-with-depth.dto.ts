import { NodeType } from '@generated/prisma/enums'

export class NodeWithDepthResponseDto {
  id: string
  name: string
  type: NodeType
  depth: number
}
