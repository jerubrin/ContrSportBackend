import { Injectable } from "@nestjs/common";
import { Event } from "./entities/event.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { Teammate } from "./entities/teammate.entity";
import { CreateEventRequest } from "./model/create-event.req.model";
import { ExpenditureItem } from "./entities/expenditure-item.entity";
import { EventResponce } from "./model/event.res.model";
import { User } from "src/auth/user.entity";
import { TeammateRes } from "./model/teammate.res";

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(ExpenditureItem)
    private expenditureRepository: Repository<ExpenditureItem>,
    @InjectRepository(Teammate)
    private teammateRepository: Repository<Teammate>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async allEvents(email: string) {
    const itemsInTeam = await this.teammateRepository.findBy({ email });
    const events = await Promise.all(
      itemsInTeam.map((teammate) => this.eventRepository.findOneBy({ id: teammate.eventID }))
    )
    console.log(events);
    const eventRes = await Promise.all(
      events.map((event) => this.collectEvent(event))
    );
    return eventRes;
  }

  oneEvent(id: number) {
    return this.eventRepository.findOneBy({ id });
  }

  async createNewEvent(userEmail: string, eventReq: CreateEventRequest) {
    const { address, date, expenditure, place, team } = eventReq;
    const event = {
      address,
      date,
      place,
    };
    const newTeam = [ userEmail, ...team ];
    const newEvent = await this.eventRepository.save(event);
    console.log(newEvent);
    const teamArr: Omit<Teammate, "id">[] = await Promise.all(
      newTeam.map((email) => ({
        eventID: newEvent.id,
        email,
        confirmed: false,
        paid: 0,
      }))
    );
    this.teammateRepository.save(teamArr);
    const newExpenditure = expenditure.map((ex) => ({ ...ex, eventID: newEvent.id }))
    await this.expenditureRepository.save(newExpenditure);
    return await this.collectEvent(newEvent);
  }

  async deleteEvent(id: number) {
    const team = await this.teammateRepository.findBy({ eventID: id });
    team.forEach((item) => this.teammateRepository.delete({ id: item.id }))
    const expenditure = await this.expenditureRepository.findBy({ eventID: id });
    expenditure.forEach((item) => this.teammateRepository.delete({ id: item.id }))
    return await this.eventRepository.delete({ id });
  }

  async confirm(email: string, id: number) {
    const teammate = await this.teammateRepository.findOneBy({ email, eventID: id });
    teammate.confirmed = true;
    await this.teammateRepository.save(teammate);
    return this.collectEvent(await this.eventRepository.findOneBy({ id }));
  }

  async payment(email: string, id: number, price: number) {
    const teammate = await this.teammateRepository.findOneBy({ email, eventID: id });
    teammate.paid += price;
    await this.teammateRepository.save(teammate);
    return this.collectEvent(await this.eventRepository.findOneBy({ id }));
  }

  private async collectEvent(event: Event) {
    const expenditure = await this.expenditureRepository.findBy({ eventID: event.id });
    const teammates: Teammate[] = await this.teammateRepository.findBy({ eventID: event.id })
    const price = expenditure.reduce((sum, item) => sum + item.price, 0);
    const priceForPersone = price / teammates.length;

    const team = await Promise.all(
      teammates.map(async (teammate) => {
        const user = await this.usersRepository.findOneBy({ email: teammate.email });
        const res: TeammateRes = {
          email: teammate.email,
          confirmed: teammate.confirmed,
          paid: teammate.paid,
          eventID: event.id,
          firstName: user.firstName,
          gender: user.gender,
          lastName: teammate.confirmed ? user.lastName : null,
          countryCode: teammate.confirmed ? user.countryCode : null,
          phone: teammate.confirmed ? user.phone : null,
          telegram: teammate.confirmed ? user.telegram : null,
        };
        return res;
      })
    )
  
    const eventRes: EventResponce = {
      id: event.id,
      address: event.address,
      date: event.date,
      place: event.place,
      price,
      priceForPersone,
      expenditure,
      team,
    };
  
    return eventRes;
  }
}
