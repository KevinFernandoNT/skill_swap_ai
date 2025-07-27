import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PythonApiService {
  private readonly logger = new Logger(PythonApiService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Search for matching keywords using Python API
   */
  async searchKeywords(keywords: string[]): Promise<string[]> {
    try {
      this.logger.log(`Searching for matching keywords: ${JSON.stringify(keywords)}`);

      // TODO: Replace with actual Python API endpoint
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:5000/api/v1/search/keywords', {
          keywords
        })
      );


      var matchingKeywords = response.data.response ?? [];

   

      this.logger.log(`Found matching keywords: ${JSON.stringify(matchingKeywords)}`);
      
      return matchingKeywords;
    } catch (error) {
      this.logger.error(`Error searching keywords: ${error.message}`);
      // Return original keywords as fallback
      return keywords;
    }
  }
} 