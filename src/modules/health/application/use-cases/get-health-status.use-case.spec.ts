import { GetHealthStatusUseCase } from './get-health-status.use-case';

describe('GetHealthStatusUseCase', () => {
  it('returns the current application health payload', () => {
    const useCase = new GetHealthStatusUseCase();

    const result = useCase.execute();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('directads-backend');
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });
});
