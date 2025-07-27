import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { SkillsService } from './skills.service';

export interface PythonApiRequest {
  topic: string;
  sub_topics: string[];
}

export interface PythonApiResponse {
  response: string[];
}

@Injectable()
export class SkillsHttpService {
  private readonly logger = new Logger(SkillsHttpService.name);
  private readonly pythonApiBaseUrl = 'http://127.0.0.1:5000/api/v1';

  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => SkillsService)) private readonly skillsService: SkillsService,
  ) {}

  /**
   * Send skill data to Python API for processing and save response to skill metadata
   * This method runs asynchronously and does not block the main request
   */
  async sendSkillToPythonApi(skillId: string, skillName: string, agenda: string[]): Promise<void> {
    try {
      this.logger.log(`Starting background process to send skill data to Python API for skill: ${skillId}`);
      this.logger.log(`Skill: ${skillName}, Agenda: ${JSON.stringify(agenda)}`);

      const requestData: PythonApiRequest = {
        topic: skillName,
        sub_topics: agenda
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

      this.logger.log(`Python API response received successfully for skill`);
      this.logger.log(`Response status: ${response.status}`);
      this.logger.log(`Response data: ${JSON.stringify(response.data)}`);
      
      // Log the processed response
      if (response.data && response.data.response) {
        this.logger.log(`Processed response items count: ${response.data.response.length}`);
        this.logger.log(`Processed response items: ${JSON.stringify(response.data.response)}`);

        // Use skills service to update the skill with the returned keywords
        await this.updateSkillWithMetadata(skillId, response.data.response);
      } else {
        await this.updateSkillWithMetadata(skillId, []); // Save empty array on error
      }

      this.logger.log(`Background process completed successfully for skill: ${skillName}, skill metadata updated`);
    } catch (error) {
      this.logger.error(`Failed to send skill data to Python API for skill: ${skillName}`);
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
        await this.updateSkillWithMetadata(skillId, []);
        this.logger.log(`Empty metadata saved for skill due to error: ${skillId}`);
      } catch (metadataError) {
        this.logger.error(`Failed to save error metadata: ${metadataError.message}`);
      }
      
      // Don't rethrow the error - this is a background process
      // We log the error and continue
    }
  }

  /**
   * Update skill metadata using the skills service
   */
  private async updateSkillWithMetadata(skillId: string, metadata: string[]): Promise<void> {
    try {
      this.logger.log(`Updating skill metadata for skill: ${skillId} using skills service`);
      this.logger.log(`Metadata to save: ${JSON.stringify(metadata)}`);
      
      // Use the skills service to update skill metadata
      await this.skillsService.updateSkillMetadata(skillId, metadata);
      
      this.logger.log(`Skill metadata updated successfully for skill: ${skillId}`);
    } catch (error) {
      this.logger.error(`Failed to update skill metadata: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute the background process without blocking the main thread
   */
  executeBackgroundProcess(skillId: string, skillName: string, agenda: string[]): void {
    // Execute in the next tick to ensure it doesn't block the current request
    process.nextTick(async () => {
      await this.sendSkillToPythonApi(skillId, skillName, agenda);
    });
  }
} 