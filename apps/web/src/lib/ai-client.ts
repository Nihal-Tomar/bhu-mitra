import type { AiQueryDto, AiMessage, AiConversationSession } from '@bhumitra/types';
import { executeOfflineQuery } from './ai-offline-engine';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function sendAiQuery(dto: AiQueryDto, token?: string): Promise<AiMessage> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}/api/v1/ai/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify(dto),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`AI request failed with status: ${res.status}`);
    }

    const json = await res.json();
    return json.data;
  } catch (err) {
    // Fall back seamlessly to grounded client-side engine with live application data
    return executeOfflineQuery(dto);
  }
}

export async function fetchAiConversations(): Promise<AiConversationSession[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/ai/conversations`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function clearAiConversation(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/ai/conversations/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAiBriefing(): Promise<AiMessage> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}/api/v1/ai/briefing`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`AI Briefing failed with status: ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  } catch {
    return executeOfflineQuery({ message: "Today's Priorities and Briefing", inputSource: 'text' });
  }
}

export function getAiReportCsvUrl(): string {
  return `${API_BASE_URL}/api/v1/ai/reports/csv`;
}

