import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { EventService } from './event.service';
import { EventResponce } from './model/event.res.model';
import { CreateEventRequest } from './model/create-event.req.model';

@ApiTags('Events API')
@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  @ApiOperation({ summary: 'Get all user events' })
  @ApiResponse({ status: 201, type: [EventResponce] })
  @UseGuards(JwtAuthGuard)
  @Get('list')
  getAllEvents(@Request() req) {
    return this.eventService.allEvents(req.user.email);
  }

  @ApiOperation({ summary: 'Get one event by id' })
  @ApiResponse({ status: 201, type: EventResponce })
  @UseGuards(JwtAuthGuard)
  @Get('item')
  @ApiQuery({
    name: 'id',
    description:
      'Get one event by id (/events/item?id=1)',
    example: 1,
  })
  getEvent(@Query() { id }: { id: number }) {
    return this.eventService.oneEvent(id);
  }

  @ApiOperation({ summary: 'Create event' })
  @ApiResponse({ status: 201, type: EventResponce })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  createEvent(@Body() eventReq: CreateEventRequest, @Request() req) {
    console.log(eventReq, req.body);
    return this.eventService.createNewEvent(req.user.email, eventReq);
  }

  @ApiOperation({ summary: 'Delete one event by id' })
  @ApiResponse({ status: 204 })
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  @ApiQuery({
    name: 'id',
    description:
      'Delete one event by id (/events/delete?id=1)',
    example: 1,
  })
  deleteEvent(@Query() { id }: { id: number }) {
    return this.eventService.deleteEvent(id);
  }

  @ApiOperation({ summary: 'Confirm participation in the event by event-id' })
  @ApiResponse({ status: 201 })
  @UseGuards(JwtAuthGuard)
  @Get('confirm')
  @ApiQuery({
    name: 'id',
    description:
      'Confirm participation in the event by event-id (/events/confirm?id=1)',
    example: 1,
  })
  confirmEvent(@Request() req, @Query() { id }: { id: number }) {
    return this.eventService.confirm(req.user.email, id);
  }

  @ApiOperation({ summary: 'Confirm participation in the event by event-id' })
  @ApiResponse({ status: 201 })
  @UseGuards(JwtAuthGuard)
  @Get('pay')
  @ApiQuery({
    name: 'id',
    description:
      'Pay for the event by event-id (/events/confirm?id=1&price=100)',
    example: 1,
  })
  @ApiQuery({
    name: 'price',
    description:
      'Pay for the event by event-id (/events/confirm?id=1&price=100)',
    example: 100,
  })
  confirmEventPayment(@Request() req, @Query() { id, price }: { id: number, price?: number }) {
    return this.eventService.payment(req.user.email, id, price ?? 0);
  }
}
