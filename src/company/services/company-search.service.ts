import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { SearchService } from 'src/search/services/search.service';
import { FindCompanyDto } from '../dto/find-company.dto';

@Injectable()
export class CompanySearchService {
  constructor(protected searchService: SearchService) {}

  async list(findCompanyDto: FindCompanyDto, eventId: string): Promise<any> {
    try {
      const query: QueryDslQueryContainer = findCompanyDto.textSearch
        ? {
            bool: {
              should: {
                multi_match: {
                  query: findCompanyDto.textSearch,
                  fields: [
                    'name',
                    'brief',
                    'keywords.name',
                    'keyIndicators',
                    'contacts.firstname',
                    'contacts.lastname',
                    'country.name',
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
        index: 'company',
        from: findCompanyDto.skip,
        size: findCompanyDto.limit,
        projection: findCompanyDto.necessaryProjectionArray,
        query,
      });
      return resp;
    } catch (err) {
      throw err;
    }
  }

  async create(company) {
    await this.searchService.create('company', company);
  }

  async update() {}
}
