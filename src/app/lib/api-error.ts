import axios from 'axios';

interface ApiErrorBody {
  message?: string;
  data?: ApiErrorData;
}

interface ApiErrorIssue {
  message?: string;
}

type ApiErrorData = ApiErrorIssue[] | Record<string, ApiErrorIssue> | null;

function collectMessages(data: ApiErrorData | undefined): string[] {
  if (!data) return [];
  const issues = Array.isArray(data) ? data : Object.values(data);
  return issues.map((issue) => issue.message).filter((message): message is string => Boolean(message));
}

export function getApiErrorMessage(error: Error, fallback: string): string {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return error.message || fallback;

  const body = error.response?.data;
  const validationMessages = collectMessages(body?.data);

  return validationMessages.join('. ') || body?.message || fallback;
}