import { Injectable } from '@nestjs/common'

import { CreateGroupDto } from '@app/modules/groups/dto/create-group.dto'
import { CreateGroupUseCase } from '@app/modules/groups/use-cases/create-group.use-case'
import { BaseNodeResponseDto } from '@app/shared/dto'

@Injectable()
export class GroupService {
  constructor(private readonly createGroupUseCase: CreateGroupUseCase) {}

  create(dto: CreateGroupDto): Promise<BaseNodeResponseDto> {
    return this.createGroupUseCase.execute(dto)
  }
}
