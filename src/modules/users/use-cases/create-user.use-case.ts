import { ConflictException, Injectable } from '@nestjs/common'

import { NodeType } from '@generated/prisma/enums'

import { DatabaseService } from '@app/core/database/database.service'
import { CreateUserDto } from '@app/modules/users/dto'
import { BaseNodeResponseDto } from '@app/shared/dto/base-node.dto'

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly dbService: DatabaseService) {}

  async execute(dto: CreateUserDto): Promise<BaseNodeResponseDto> {
    const { name, email } = dto

    const existing = await this.dbService.node.findUnique({ where: { email } })
    if (existing) {
      throw new ConflictException('Email already exists')
    }

    return await this.dbService.$transaction(async (tx) => {
      const user = await tx.node.create({ data: { name, email, type: NodeType.USER } })

      await tx.nodeClosure.create({
        data: { ancestorId: user.id, descendantId: user.id, depth: 0 },
      })

      return user
    })
  }
}
