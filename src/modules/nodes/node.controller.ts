import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { NodeService } from '@app/modules/nodes/node.service'

@Controller('nodes')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get(':id/ancestors')
  @ApiOperation({ summary: 'Get Ancestors' })
  getAncestors(@Param('id') nodeId: string) {
    return this.nodeService.getAncestors(nodeId)
  }

  @Get(':id/descendants')
  @ApiOperation({ summary: 'Get Descendants' })
  getDescendants(@Param('id') nodeId: string) {
    return this.nodeService.getDescendants(nodeId)
  }
}
