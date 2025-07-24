import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { SessionsService } from '../sessions/sessions.service';

export interface PythonApiRequest {
  topic: string;
  sub_topics: string[];
}

export interface PythonApiResponse {
  response: string[];
}

@Injectable()
export class ExternalHttpService {
  private readonly logger = new Logger(ExternalHttpService.name);
  private readonly pythonApiBaseUrl = 'http://127.0.0.1:5000/api/v1';

  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => SessionsService)) private readonly sessionsService: SessionsService,
  ) {}

  /**
   * Send session data to Python API for processing and save response to session metadata
   * This method runs asynchronously and does not block the main request
   */
  async sendSessionToPythonApi(sessionId: string, skillName: string, focusKeywords: string[]): Promise<void> {
    try {
      this.logger.log(`Starting background process to send session data to Python API for session: ${sessionId}`);
      this.logger.log(`Skill: ${skillName}, Focus Keywords: ${JSON.stringify(focusKeywords)}`);

      const requestData: PythonApiRequest = {
        topic: skillName,
        sub_topics: focusKeywords
      };

      this.logger.log(`Sending request to Python API: ${this.pythonApiBaseUrl}/llm/query`);
      this.logger.log(`Request payload: ${JSON.stringify(requestData)}`);

      const response: AxiosResponse<PythonApiResponse> = await firstValueFrom(
        this.httpService.post(`${this.pythonApiBaseUrl}/llm/query`, requestData, {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: (status) => status < 500, // Accept 4xx errors but reject 5xx
        })
      );

      this.logger.log(`Python API response received successfully`);
      this.logger.log(`Response status: ${response.status}`);
      this.logger.log(`Response data: ${JSON.stringify(response.data)}`);
      
      // Log the processed response
      if (response.data && response.data.response) {
        this.logger.log(`Processed response items count: ${response.data.response.length}`);
        this.logger.log(`Processed response items: ${JSON.stringify(response.data.response)}`);

        // Use sessions service to update the session with the returned keywords
        await this.updateSessionWithMetadata(sessionId, response.data.response);
      }

      this.logger.log(`Background process completed successfully for skill: ${skillName}, session metadata updated`);
    } catch (error) {
      this.logger.error(`Failed to send session data to Python API for skill: ${skillName}`);
      this.logger.error(`Error details: ${error.message}`);
      
      if (error.response) {
        this.logger.error(`Response status: ${error.response.status}`);
        this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      
      if (error.code) {
        this.logger.error(`Error code: ${error.code}`);
      }

      // Save empty array on error
      try {
        await this.updateSessionWithMetadata(sessionId, []);
        this.logger.log(`Empty metadata saved for session due to error: ${sessionId}`);
      } catch (metadataError) {
        this.logger.error(`Failed to save error metadata: ${metadataError.message}`);
      }
      
      // Don't rethrow the error - this is a background process
      // We log the error and continue
    }
  }

  /**
   * Update session metadata using the sessions service
   */
  private async updateSessionWithMetadata(sessionId: string, metadata: string[]): Promise<void> {
    try {
      this.logger.log(`Updating session metadata for session: ${sessionId} using sessions service`);
      this.logger.log(`Metadata to save: ${JSON.stringify(metadata)}`);
      
      // Use the sessions service updateSession method
      // Note: We need to pass a dummy userId since this is a background process
      // The sessions service should be modified to handle system updates
      await this.sessionsService.updateSessionMetadata(sessionId, metadata);
      
      this.logger.log(`Session metadata updated successfully for session: ${sessionId}`);
    } catch (error) {
      this.logger.error(`Failed to update session metadata: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute the background process without blocking the main thread
   */
  executeBackgroundProcess(sessionId: string, skillName: string, focusKeywords: string[]): void {
    // Execute in the next tick to ensure it doesn't block the current request
    process.nextTick(async () => {
      await this.sendSessionToPythonApi(sessionId, skillName, focusKeywords);
    });
  }
} 