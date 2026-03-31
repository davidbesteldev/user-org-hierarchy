import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { Counter } from '@opentelemetry/api'
import { MetricService, Span } from 'nestjs-otel'

import { NodeType } from '@generated/prisma/enums'

import { DatabaseService } from '@app/core/database/database.service'

@Injectable()
export class AssociateUserToGroupUseCase {
  private associationCounter: Counter

  constructor(
    private readonly dbService: DatabaseService,
    private readonly metricService: MetricService,
  ) {
    this.associationCounter = this.metricService.getCounter('total_associations', {
      description: 'Total de associações de usuários a grupos realizadas',
    })
  }

  @Span('AssociateUserToGroupUseCase.execute', (userId, groupId) => ({
    attributes: { userId, groupId },
  }))
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

    await this.dbService.$transaction(async (tx) => {
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

    this.associationCounter.add(1, { status: 'success' })
  }
}
