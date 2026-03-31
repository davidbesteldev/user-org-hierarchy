import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { CreateUserDto } from '@app/modules/users/dto'
import { UserService } from '@app/modules/users/user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body)
  }

  @Post(':id/groups')
  @HttpCode(204)
  @ApiOperation({ summary: 'Associate User To Group' })
  associateUser(@Param('id') userId: string, @Body() body: { groupId: string }) {
    return this.userService.associateUserToGroup(userId, body.groupId)
  }

  @Get(':id/organizations')
  @ApiOperation({ summary: 'Get User Organizations' })
  getUserOrganizations(@Param('id') userId: string) {
    return this.userService.getUserOrganizations(userId)
  }
}
