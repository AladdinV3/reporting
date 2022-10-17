import { DownloadPresignedURL } from '@aldb2b/common';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { presignedUrlExpiration, S3Buckets } from 'src/core/config/config';
import { AuthorizedS3 } from 'src/core/services/AWS';
import { ElasticSearchIndex } from 'src/search/model/elastic-search-index.enum';
import { SearchService } from 'src/search/services/search.service';
import { FindEventDto } from '../dto/find-event.dto';
import { EventDocument } from '../models/event.schema';

@Injectable()
export class EventService {
  constructor(private searchService: SearchService) {}

  async list(findEventDto: FindEventDto): Promise<any> {
    try {
      const query: QueryDslQueryContainer = findEventDto.textSearch
        ? {
            bool: {
              should: [
                {
                  multi_match: {
                    query: findEventDto.textSearch,
                    fields: ['name', 'countryId.name', 'cityId.name'],
                    fuzziness: 'auto',
                  },
                },
                {
                  wildcard: {
                    name: `*${findEventDto.textSearch}*`,
                  },
                },
              ],
            },
          }
        : {
            match_all: {},
          };
      const events = await this.searchService.search({
        index: ElasticSearchIndex.EVENT,
        from: findEventDto.skip,
        size: findEventDto.limit,
        projection: findEventDto.necessaryProjectionArray,
        query,
      });
      console.log('EVENTS-------------------', events);
      events.data = await this.addImageUrls(events.data);
      return events;
      // if (findEventDto.textSearch) {
      //   const query = {
      //     $or: [
      //       { name: { $regex: `(?i)${findEventDto.textSearch}` } },
      //       {
      //         'countryId.name': { $regex: `(?i)${findEventDto.textSearch}` },
      //       },
      //       { 'cityId.name': { $regex: `(?i)${findEventDto.textSearch}` } },
      //     ],
      //   };
      //   console.log('QUERY-----------------', query);
      //   let { data: events } = await this.eventSearchRepository.read({
      //     query,
      //     lean: true,
      //   });
      //   console.log('RESULT-----------------', events);
      //   events = await this.addImageUrls(events);
      //   return events;
      // } else {
      //   findEventDto.lean = true;
      //   let { data: events } = await this.eventSearchRepository.read(
      //     findEventDto,
      //   );
      //   events = await this.addImageUrls(events);
      //   return events;
      // }
    } catch (err) {
      throw err;
    }
  }

  private async addImageUrls(events): Promise<EventDocument[]> {
    const brandings = this.getBrandings(events);
    const logoImageUrlsPromise = this.getImageUrlPromises(
      brandings,
      'logoImage',
    );
    const bgImageUrlsPromise = this.getImageUrlPromises(brandings, 'bgImage');
    const presignedUrls = await Promise.all(logoImageUrlsPromise);
    const bgPresignedUrls = await Promise.all(bgImageUrlsPromise);
    const brandingsWithImage = brandings.map((rec) => {
      if (rec.logoImage) {
        const url = presignedUrls.find((item) => item.file === rec.logoImage);
        rec.logoImage = url?.downloadURL || rec.logoImage;
      }
      if (rec.bgImage) {
        const url = bgPresignedUrls.find((item) => item.file === rec.bgImage);
        rec.bgImage = url?.downloadURL || rec.bgImage;
      }
      return rec;
    });
    const newEvents = events.map((item) => {
      if (item.branding && item.branding.length) {
        const brandingIds = item.branding.map((item) => String(item._id));
        item.branding = brandingsWithImage.filter((item) =>
          brandingIds.includes(String(item._id)),
        );
      }
      return item;
    });
    return newEvents;
  }

  private getBrandings(events) {
    return events
      .filter((event) => event.brandings && event.brandings.length)
      .map((event) => event.brandings)
      .flat();
  }

  private getImageUrlPromises(brandings, field: string) {
    return brandings
      .filter((rec) => rec[field])
      .map((rec) => this.getFileUrl(rec[field]));
  }

  private async getFileUrl(file: string): Promise<DownloadPresignedURL> {
    const url = await AuthorizedS3.getSignedUrlPromise('getObject', {
      Bucket: S3Buckets.brandingImages,
      Key: file,
      Expires: presignedUrlExpiration.download,
    });
    return { file: file, downloadURL: url };
  }
}
