import { HeaderUser } from '@aldb2b/common';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { ElasticSearchIndex } from 'src/search/model/elastic-search-index.enum';
import { SearchService } from 'src/search/services/search.service';
import { FindQuotationDto } from '../dto/find-quotation.dto';

@Injectable()
export class QuotationSearchService {
  constructor(private searchService: SearchService) {}

  async allQuotations(
    filterDto: FindQuotationDto,
    eventId: string,
    user: HeaderUser,
  ): Promise<any> {
    try {
      const mustQuery = this.getAllMustQuery(eventId, user);
      const query = this.getQuery(filterDto, mustQuery);

      return this.getQuotations(filterDto, query);
    } catch (err) {
      throw err;
    }
  }

  private getQuery(filterDto: FindQuotationDto, mustQuery) {
    const query: QueryDslQueryContainer = filterDto.textSearch
      ? {
          bool: {
            should: this.getShouldQuery(filterDto.textSearch),
            must: mustQuery,
          },
        }
      : {
          bool: { must: mustQuery },
        };
    return query;
  }

  async incomingQuotations(
    filterDto: FindQuotationDto,
    eventId: string,
    user: HeaderUser,
  ): Promise<any> {
    try {
      const mustQuery = this.getIncomingMustQuery(eventId, user);
      const query = this.getQuery(filterDto, mustQuery);

      return this.getQuotations(filterDto, query);
    } catch (err) {
      throw err;
    }
  }

  private async getQuotations(filterDto: FindQuotationDto, query) {
    return this.searchService.search({
      index: ElasticSearchIndex.QUOTATION,
      from: filterDto.skip,
      size: filterDto.limit,
      projection: filterDto.necessaryProjectionArray,
      query,
    });
  }

  async outgoingQuotations(
    filterDto: FindQuotationDto,
    eventId: string,
    user: HeaderUser,
  ): Promise<any> {
    try {
      const mustQuery = this.getOutgoingMustQuery(eventId, user);
      const query = this.getQuery(filterDto, mustQuery);
      return this.getQuotations(filterDto, query);
    } catch (err) {
      throw err;
    }
  }

  private getIncomingMustQuery(eventId: string, user: HeaderUser) {
    return [
      { term: { eventId } },
      {
        bool: {
          should: [
            { term: { 'receiverCompnaies._id': user.company } },
            { term: { 'receiverContacts._id': user.contactId } },
            { term: { 'rfq.company': user.company } },
          ],
        },
      },
    ];
  }

  private getOutgoingMustQuery(eventId: string, user: HeaderUser) {
    return [{ term: { eventId } }, { term: { company: user.company } }];
  }

  private getAllMustQuery(eventId: string, user: HeaderUser) {
    return [
      { term: { eventId } },
      {
        bool: {
          should: [
            { term: { 'receiverCompnaies._id': user.company } },
            { term: { 'receiverContacts._id': user.contactId } },
            { term: { 'rfq.company': user.company } },
            { term: { 'company._id': user.company } },
          ],
        },
      },
    ];
  }

  private getShouldQuery(textSearch: string) {
    return {
      multi_match: {
        query: textSearch,
        fields: [
          'title',
          'company.name',
          'contact.firstname',
          'contact.lastname',
          'contact.fullname',
        ],
        fuzziness: 'auto',
      },
    };
  }
}
