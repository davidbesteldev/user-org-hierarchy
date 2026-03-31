import { Injectable, NotFoundException } from '@nestjs/common'

import { DatabaseService } from '@app/core/database/database.service'
import { NodeWithDepthResponseDto } from '@app/shared/dto/node-with-depth.dto'

@Injectable()
export class GetAncestorsUseCase {
  constructor(private readonly dbService: DatabaseService) {}

  async execute(nodeId: string): Promise<NodeWithDepthResponseDto[]> {
    const nodeExists = await this.dbService.node.findUnique({ where: { id: nodeId } })
    if (!nodeExists) throw new NotFoundException('node not found')

    const relations = await this.dbService.nodeClosure.findMany({
      where: { descendantId: nodeId, depth: { gt: 0 } },
      include: { ancestor: true },
      orderBy: { depth: 'asc' },
    })

    return relations.map((rel) => ({
      id: rel.ancestor.id,
      name: rel.ancestor.name,
      type: rel.ancestor.type,
      depth: rel.depth,
    }))
  }
}
