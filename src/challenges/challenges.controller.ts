import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Request } from 'express';
import { GetChallengeDto } from './dto/get-challenge.dto';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createChallengeDto: CreateChallengeDto, @Req() req: Request) {
    return this.challengesService.create(createChallengeDto, req);
  }

  @Get()
  findAll(@Query() query: GetChallengeDto) {
    return this.challengesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChallengeDto: UpdateChallengeDto) {
    return this.challengesService.update(id, updateChallengeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengesService.remove(id);
  }
}
