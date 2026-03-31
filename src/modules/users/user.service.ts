import { Injectable } from '@nestjs/common'

import { CreateUserDto } from '@app/modules/users/dto'
import {
  AssociateUserToGroupUseCase,
  CreateUserUseCase,
  GetUserOrganizationsUseCase,
} from '@app/modules/users/use-cases'
import { BaseNodeResponseDto, NodeWithDepthResponseDto } from '@app/shared/dto'

@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly associateUserToGroupUseCase: AssociateUserToGroupUseCase,
    private readonly getUserOrganizationsUseCase: GetUserOrganizationsUseCase,
  ) {}

  create(dto: CreateUserDto): Promise<BaseNodeResponseDto> {
    return this.createUserUseCase.execute(dto)
  }

  associateUserToGroup(userId: string, groupId: string): Promise<void> {
    return this.associateUserToGroupUseCase.execute(userId, groupId)
  }

  getUserOrganizations(userId: string): Promise<NodeWithDepthResponseDto[]> {
    return this.getUserOrganizationsUseCase.execute(userId)
  }
}
