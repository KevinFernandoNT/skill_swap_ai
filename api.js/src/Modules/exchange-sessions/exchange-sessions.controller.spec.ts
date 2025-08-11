import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeSessionsController } from './exchange-sessions.controller';
import { ExchangeSessionsService } from './exchange-sessions.service';

describe('ExchangeSessionsController', () => {
  let controller: ExchangeSessionsController;
  const mockService = {
    update: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeSessionsController],
      providers: [{ provide: ExchangeSessionsService, useValue: mockService }],
    }).compile();

    controller = module.get<ExchangeSessionsController>(ExchangeSessionsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('starts an exchange session (status -> ongoing)', async () => {
    const req = { user: { _id: 'u1' } } as any;
    mockService.update.mockResolvedValue({ _id: 'es1', status: 'ongoing' });
    const res = await controller.start(req, 'es1');
    expect(mockService.update).toHaveBeenCalledWith('u1', 'es1', { status: 'ongoing' });
    expect(res).toEqual({ _id: 'es1', status: 'ongoing' });
  });

  it('completes an exchange session (status -> completed)', async () => {
    const req = { user: { _id: 'u1' } } as any;
    mockService.update.mockResolvedValue({ _id: 'es1', status: 'completed' });
    const res = await controller.complete(req, 'es1');
    expect(mockService.update).toHaveBeenCalledWith('u1', 'es1', { status: 'completed' });
    expect(res).toEqual({ _id: 'es1', status: 'completed' });
  });
});


