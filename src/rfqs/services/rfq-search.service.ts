import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ElasticSearchIndex } from 'src/search/model/elastic-search-index.enum';
import { SearchService } from 'src/search/services/search.service';
import { FindRFQDto } from '../dto/find-rfq.dto';
import { RFQSearchRepository } from '../models/rfq-search.repository';

@Injectable()
export class RFQSearchService {
  constructor(
    // private rfqSearchRepository: RFQSearchRepository,
    private searchService: SearchService,
  ) {}

  async list(filterDto: FindRFQDto, eventId: string): Promise<any> {
    try {
      const query: QueryDslQueryContainer = filterDto.textSearch
        ? {
            bool: {
              should: {
                multi_match: {
                  query: filterDto.textSearch,
                  fields: [
                    'title',
                    'company.name',
                    'description',
                    'products.product.name',
                    'services.service.name',
                    'products.categories.title',
                    'services.categories.title',
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
        index: ElasticSearchIndex.RFQ,
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
      //       { title: { $regex: `(?i)${textSearch}` } },
      //       { 'company.name': { $regex: `(?i)${textSearch}` } },
      //       { description: { $regex: `(?i)${textSearch}` } },
      //       { 'products.product.name': { $regex: `(?i)${textSearch}` } },
      //       { 'products.categories.title': { $regex: `(?i)${textSearch}` } },
      //       { 'services.categories.title': { $regex: `(?i)${textSearch}` } },
      //     ],
      //   };
      //   if (eventId) query['eventId'] = new mongoose.Types.ObjectId(eventId);
      //   console.log('QUERY-------------', query);
      //   return this.rfqSearchRepository.read({ query });
      // } else {
      //   if (eventId) {
      //     if (filterDto.query) {
      //       filterDto.query = this.parseQuery(filterDto.query);
      //       filterDto.query['eventId'] = new mongoose.Types.ObjectId(eventId);
      //     } else {
      //       filterDto.query = { eventId: new mongoose.Types.ObjectId(eventId) };
      //     }
      //   }
      //   return this.rfqSearchRepository.read(filterDto);
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
