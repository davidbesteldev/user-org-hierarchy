import { Injectable } from '@nestjs/common'

import { GetAncestorsUseCase, GetDescendantsUseCase } from '@app/modules/nodes/use-cases'
import { NodeWithDepthResponseDto } from '@app/shared/dto'

@Injectable()
export class NodeService {
  constructor(
    private readonly getAncestorsUseCase: GetAncestorsUseCase,
    private readonly getDescendantsUseCase: GetDescendantsUseCase,
  ) {}

  getAncestors(nodeId: string): Promise<NodeWithDepthResponseDto[]> {
    return this.getAncestorsUseCase.execute(nodeId)
  }

  getDescendants(nodeId: string): Promise<NodeWithDepthResponseDto[]> {
    return this.getDescendantsUseCase.execute(nodeId)
  }
}
