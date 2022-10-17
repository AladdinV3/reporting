import { Controller } from '@nestjs/common';
import { MessageBrokerService } from '../services/message-broker.service';

@Controller()
export class MessageBrokerController {
  constructor(private messageBrokerService: MessageBrokerService) {}

}
