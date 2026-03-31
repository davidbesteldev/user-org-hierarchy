import { Injectable, NotFoundException } from '@nestjs/common'

import { NodeType } from '@generated/prisma/enums'

import { DatabaseService } from '@app/core/database/database.service'
import { CreateGroupDto } from '@app/modules/groups/dto/create-group.dto'
import { BaseNodeResponseDto } from '@app/shared/dto/base-node.dto'

@Injectable()
export class CreateGroupUseCase {
  constructor(private readonly dbService: DatabaseService) {}

  async execute(dto: CreateGroupDto): Promise<BaseNodeResponseDto> {
    const { name, parentId } = dto

    if (parentId) {
      const parent = await this.dbService.node.findFirst({
        where: { id: parentId, type: NodeType.GROUP },
      })
      if (!parent) throw new NotFoundException('Parent group not found')
    }

    return await this.dbService.$transaction(async (tx) => {
      const group = await tx.node.create({ data: { name, type: NodeType.GROUP } })

      await tx.nodeClosure.create({
        data: { ancestorId: group.id, descendantId: group.id, depth: 0 },
      })

      if (parentId) {
        const ancestorsOfParent = await tx.nodeClosure.findMany({
          where: { descendantId: parentId },
        })

        const closureEntries = ancestorsOfParent.map((rel) => ({
          ancestorId: rel.ancestorId,
          descendantId: group.id,
          depth: rel.depth + 1,
        }))

        await tx.nodeClosure.createMany({ data: closureEntries })
      }

      return group
    })
  }
}
