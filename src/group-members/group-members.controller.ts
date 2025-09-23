import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { Request } from 'express';
import { GetGroupMemberDto } from './dto/get-grpup-member.dto';

@Controller('group-members')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @Post()
  create(@Body() createGroupMemberDto: CreateGroupMemberDto, @Req() req: Request) {
    return this.groupMembersService.create(createGroupMemberDto, req);
  }

  @Get()
  findAll(@Query() query: GetGroupMemberDto) {
    return this.groupMembersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupMembersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupMemberDto: UpdateGroupMemberDto) {
    return this.groupMembersService.update(id, updateGroupMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupMembersService.remove(id);
  }
}
