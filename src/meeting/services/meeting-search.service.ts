import { Injectable } from '@nestjs/common';
import { FindMeetingDto } from '../dto/find-meeting.dto';
import { MeetingSearchRepository } from '../models/meeting-search.repository';
import * as mongoose from 'mongoose';
import { SearchService } from 'src/search/services/search.service';
import { ElasticSearchIndex } from 'src/search/model/elastic-search-index.enum';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class MeetingSearchService {
  constructor(
    // private meetingSearchRepository: MeetingSearchRepository,
    private searchService: SearchService,
  ) {}

  async list(filterDto: FindMeetingDto, eventId: string): Promise<any> {
    try {
      const query: QueryDslQueryContainer = filterDto.textSearch
        ? {
            bool: {
              should: {
                multi_match: {
                  query: filterDto.textSearch,
                  fields: [
                    'guestId.firstname',
                    'guestId.lastname',
                    'guestId.email',
                    'guestId.mobile',
                    'hostId.firstname',
                    'hostId.lastname',
                    'hostId.email',
                    'hostId.mobile',
                    'hostCompanyId.name',
                    'hostCompanyId.country.name',
                    'guestCompanyId.name',
                    'guestCompanyId.country.name',
                    'hall.name',
                    'hall.address',
                  ],
                  fuzziness: 'auto',
                },
              },
              must: {
                term: {
                  eventId,
                },
              },
            },
          }
        : {
            bool: {
              must: {
                term: {
                  eventId,
                },
              },
            },
          };

      const resp = await this.searchService.search({
        index: ElasticSearchIndex.MEETING,
        from: filterDto.skip,
        size: filterDto.limit,
        projection: filterDto.necessaryProjectionArray,
        query,
      });
      return resp;

      // if (filterDto.textSearch) {
      //   const { textSearch } = filterDto;
      //   const query = {
      //     $or: [
      //       { 'guestId.firstname': { $regex: `(?i)${textSearch}` } },
      //       { 'guestId.lastname': { $regex: `(?i)${textSearch}` } },
      //       { 'guestId.email': { $regex: `(?i)${textSearch}` } },
      //       { 'guestId.mobile': { $regex: `(?i)${textSearch}` } },
      //       { 'hostId.firstname': { $regex: `(?i)${textSearch}` } },
      //       { 'hostId.lastname': { $regex: `(?i)${textSearch}` } },
      //       { 'hostId.email': { $regex: `(?i)${textSearch}` } },
      //       { 'hostId.mobile': { $regex: `(?i)${textSearch}` } },
      //       { 'hostCompanyId.name': { $regex: `(?i)${textSearch}` } },
      //       { 'hostCompanyId.country.name': { $regex: `(?i)${textSearch}` } },
      //       { 'guestCompanyId.name': { $regex: `(?i)${textSearch}` } },
      //       { 'guestCompanyId.country.name': { $regex: `(?i)${textSearch}` } },
      //       { 'hall.name': { $regex: `(?i)${textSearch}` } },
      //       { 'hall.address': { $regex: `(?i)${textSearch}` } },
      //     ],
      //   };
      //   if (eventId) query['eventId'] = new mongoose.Types.ObjectId(eventId);
      //   return this.meetingSearchRepository.read({ query });
      // } else {
      //   if (eventId) {
      //     if (filterDto.query) {
      //       filterDto.query = this.parseQuery(filterDto.query);
      //       filterDto.query['eventId'] = new mongoose.Types.ObjectId(eventId);
      //     } else {
      //       filterDto.query = { eventId: new mongoose.Types.ObjectId(eventId) };
      //     }
      //   }
      //   return this.meetingSearchRepository.read(filterDto);
      // }
    } catch (err) {
      throw err;
    }
  }
  parseQuery(query) {
    try {
      return JSON.parse(query);
    } catch (err) {
      return query;
    }
  }
}
