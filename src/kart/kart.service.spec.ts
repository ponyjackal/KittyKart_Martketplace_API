import { Test, TestingModule } from '@nestjs/testing';
import { KartService } from './kart.service';

describe('KartService', () => {
  let service: KartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KartService],
    }).compile();

    service = module.get<KartService>(KartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
