import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/user.entity";
import { Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import { ExpenditureItem } from "./entities/expenditure-item.entity";
import { Teammate } from "./entities/teammate.entity";
import { MailService } from './mail.service';
import { CreateEventRequest } from "./model/create-event.req.model";
import { EventResponce } from "./model/event.res.model";
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
    private mailService: MailService,
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

  async oneEvent(id: number) {
    return await this.collectEvent(
      await this.eventRepository.findOneBy({ id }),
    );
  }

  async createNewEvent(userEmail: string, eventReq: CreateEventRequest) {
    const { address, date, expenditure, place, team } = eventReq;
    const event = {
      address,
      date,
      place,
    };
    const newTeam = [userEmail, ...team];
    const newEvent = await this.eventRepository.save(event);
    console.log(newEvent);
    const teamArr: Omit<Teammate, "id">[] = await Promise.all(
      newTeam.map((email) => ({
        eventID: newEvent.id,
        email,
        confirmed: false,
        paid: 0,
      })),
    );
    this.teammateRepository.save(teamArr);
    const newExpenditure = expenditure.map((ex) => ({ ...ex, eventID: newEvent.id }))
    await this.expenditureRepository.save(newExpenditure);
    const mainUser = await this.usersRepository.findOneBy({ email: userEmail });
    teamArr.forEach((user, i) => {
      if (i === 0) {
        return;
      }

      this.mailService.sendNotifyAddedToEvent(
        user.email,
        `${mainUser.firstName} ${mainUser.lastName}`,
        newEvent,
      ).catch((err) => console.log(err));
    });
    return await this.collectEvent(newEvent);
  }

  async deleteEvent(id: number) {
    const team = await this.teammateRepository.findBy({ eventID: id });
    team.forEach((item) => this.teammateRepository.delete({ id: item.id }))
    const expenditure = await this.expenditureRepository.findBy({ eventID: id });
    expenditure.forEach((item) => this.teammateRepository.delete({ id: item.id }))
    const mainUserTeammate = (await this.teammateRepository.findOneBy({ eventID: id }));
    const mainUser = (await this.usersRepository.findOneBy({ email: mainUserTeammate.email }));
    team.forEach(async (user, i) => {
      if (i === 0) {
        return;
      }

      this.mailService.sendNotifyRemoveEvent(
        user.email,
        `${mainUser.firstName} ${mainUser.lastName}`,
        await this.eventRepository.findOneBy({ id }),
      ).catch((err) => console.log(err));
    });
    return await this.eventRepository.delete({ id });
  }

  async confirm(email: string, id: number) {
    const teammate = await this.teammateRepository.findOneBy({ email, eventID: id });
    teammate.confirmed = true;
    await this.teammateRepository.save(teammate);
    const mainUser = await this.usersRepository.findOneBy({ email });
    (await this.teammateRepository.findBy({ eventID: id })).forEach(async (user, i) => {
      if (user.email === email) {
        return;
      }

      this.mailService.sendNotifyConfirmd(
        user.email,
        `${mainUser.firstName} ${mainUser.lastName}`,
        await this.eventRepository.findOneBy({ id }),
      ).catch((err) => console.log(err));
    });

    return this.collectEvent(await this.eventRepository.findOneBy({ id }));
  }

  async payment(email: string, id: number, price: number) {
    const teammate = await this.teammateRepository.findOneBy({ email, eventID: id });
    teammate.paid += price;
    await this.teammateRepository.save(teammate);
    const mainUser = await this.usersRepository.findOneBy({ email });
    (await this.teammateRepository.findBy({ eventID: id })).forEach(async (user, i) => {
      if (user.email === email) {
        return;
      }

      this.mailService.sendNotifyPayed(
        user.email,
        `${mainUser.firstName} ${mainUser.lastName}`,
        await this.eventRepository.findOneBy({ id }),
      ).catch((err) => console.log(err));
    });
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
