import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Request } from 'express';
import { GetPlanDto } from './dto/get-plan.dto';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createPlanDto: CreatePlanDto, @Req() req: Request) {
    return this.plansService.create(createPlanDto, req);
  }

  @Get()
  findAll(@Query() query: GetPlanDto) {
    return this.plansService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
}
