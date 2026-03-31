import { Injectable } from '@nestjs/common'

import { NodeType } from '@generated/prisma/enums'

import { DatabaseService } from '@app/core/database/database.service'
import { NodeWithDepthResponseDto } from '@app/shared/dto/node-with-depth.dto'

@Injectable()
export class GetUserOrganizationsUseCase {
  constructor(private readonly dbService: DatabaseService) {}

  async execute(userId: string): Promise<NodeWithDepthResponseDto[]> {
    const relations = await this.dbService.nodeClosure.findMany({
      where: {
        descendantId: userId,
        depth: { gt: 0 },
        ancestor: { type: NodeType.GROUP },
      },
      select: {
        depth: true,
        ancestor: { select: { id: true, name: true, type: true } },
      },
      orderBy: { depth: 'asc' },
    })

    return relations.map((r) => ({ ...r.ancestor, depth: r.depth }))
  }
}
