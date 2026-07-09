import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';

describe('FileController', () => {
  let controller: FileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: {}
        }
      ]
    }).compile();

    controller = module.get<FileController>(FileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('rejects absolute paths in loadFile', async () => {
    await expect(
      controller.loadFile('/etc/hosts', 'image/jpg', { type: jest.fn() } as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects path traversal in readFile', async () => {
    await expect(
      controller.readFile('../etc/passwd', { type: jest.fn(), status: jest.fn() } as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
