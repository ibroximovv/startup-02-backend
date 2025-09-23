import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Request } from 'express';
import { GetGroupDto } from './dto/get-group.dto';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Req() req: Request) {
    return this.groupsService.create(createGroupDto, req);
  }

  @Get()
  findAll(@Query() query: GetGroupDto) {
    return this.groupsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
