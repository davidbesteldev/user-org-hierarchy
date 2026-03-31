import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'

import { NodeType } from '@generated/prisma/enums'

import { DatabaseService } from '@app/core/database/database.service'

@Injectable()
export class AssociateUserToGroupUseCase {
  constructor(private readonly dbService: DatabaseService) {}

  async execute(userId: string, groupId: string): Promise<void> {
    const group = await this.dbService.node.findUnique({
      where: { id: groupId, type: NodeType.GROUP },
    })
    if (!group) throw new NotFoundException('group not found')

    const userNode = await this.dbService.node.findUnique({ where: { id: userId } })
    if (!userNode) throw new NotFoundException('node not found')

    const isCircular = await this.dbService.nodeClosure.findFirst({
      where: { ancestorId: userId, descendantId: groupId },
    })
    if (isCircular) {
      throw new UnprocessableEntityException('Circular hierarchy detected')
    }

    return await this.dbService.$transaction(async (tx) => {
      const groupAncestors = await tx.nodeClosure.findMany({
        where: { descendantId: groupId },
      })

      const userDescendants = await tx.nodeClosure.findMany({
        where: { ancestorId: userId },
      })

      const newLinks = []
      for (const gAnc of groupAncestors) {
        for (const uDesc of userDescendants) {
          newLinks.push({
            ancestorId: gAnc.ancestorId,
            descendantId: uDesc.descendantId,
            depth: gAnc.depth + 1 + uDesc.depth,
          })
        }
      }

      await tx.nodeClosure.createMany({ data: newLinks, skipDuplicates: true })
    })
  }
}
