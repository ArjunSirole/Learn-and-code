import { SessionService } from "../services/sessionService";

export const getHeaders = () => ({
  Authorization: `Bearer ${SessionService.getToken()}`,
});

export async function handleApiError(
  context: string,
  error: unknown
): Promise<void> {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n Error during ${context}: ${message}`);
}
