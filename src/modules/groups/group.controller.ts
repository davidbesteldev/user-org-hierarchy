import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { CreateGroupDto } from '@app/modules/groups/dto/create-group.dto'
import { GroupService } from '@app/modules/groups/group.service'

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiOperation({ summary: 'Create group' })
  create(@Body() body: CreateGroupDto) {
    return this.groupService.create(body)
  }
}
