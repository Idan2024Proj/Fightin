import { create } from 'zustand';
import { MOCK_MATCHES, MOCK_MESSAGES } from '../data/mockData';
import { Match, Message, User } from '../types';

interface MatchState {
  matches: Match[];
  messages: Record<string, Message[]>;
  addMatch: (partner: User, currentUserId: string) => void;
  sendMessage: (matchId: string, senderId: string, text: string) => void;
  markMessagesRead: (matchId: string, readerId: string) => void;
  getMessages: (matchId: string) => Message[];
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: MOCK_MATCHES,
  messages: MOCK_MESSAGES,

  addMatch: (partner: User, currentUserId: string) => {
    const existing = get().matches.find(
      (m) => m.partner.id === partner.id,
    );
    if (existing) return;

    const newMatch: Match = {
      id: `match-${Date.now()}`,
      user1Id: currentUserId,
      user2Id: partner.id,
      createdAt: new Date().toISOString(),
      partner,
    };

    set((state) => ({
      matches: [newMatch, ...state.matches],
      messages: { ...state.messages, [newMatch.id]: [] },
    }));
  },

  sendMessage: (matchId: string, senderId: string, text: string) => {
    const message: Message = {
      id: `msg-${Date.now()}`,
      matchId,
      senderId,
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };

    set((state) => {
      const thread = [...(state.messages[matchId] ?? []), message];
      const matches = state.matches.map((m) =>
        m.id === matchId ? { ...m, lastMessage: message } : m,
      );
      return {
        messages: { ...state.messages, [matchId]: thread },
        matches,
      };
    });
  },

  markMessagesRead: (matchId: string, readerId: string) => {
    set((state) => {
      const thread = (state.messages[matchId] ?? []).map((msg) =>
        msg.senderId !== readerId ? { ...msg, read: true } : msg,
      );
      const matches = state.matches.map((m) => {
        if (m.id !== matchId || !m.lastMessage || m.lastMessage.senderId === readerId) {
          return m;
        }
        return { ...m, lastMessage: { ...m.lastMessage, read: true } };
      });
      return {
        messages: { ...state.messages, [matchId]: thread },
        matches,
      };
    });
  },

  getMessages: (matchId: string) => {
    return get().messages[matchId] ?? [];
  },
}));
