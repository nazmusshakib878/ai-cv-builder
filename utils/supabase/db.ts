import { getSupabaseServerClient } from './server';
import { ResumeData, DesignConfig, ChatMessage } from '@/types/resume';
import { initialResumeData, initialDesignConfig } from '@/data/initialResumeData';

export interface ResumeRecord {
  id: string;
  user_id: string | null;
  guest_session_id: string | null;
  title: string;
  data: ResumeData;
  design: DesignConfig;
  is_paid: boolean;
  version_history?: any[];
  chat_messages?: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface UserRecord {
  id: string;
  email: string;
  password_hash?: string;
  full_name?: string;
  created_at: string;
}

// In-Memory Store for local development & fallback testing
const memoryDb = {
  users: new Map<string, UserRecord>(),
  resumes: new Map<string, ResumeRecord>(),
  versions: new Map<string, any[]>(),
  conversations: new Map<string, ChatMessage[]>(),
  payments: new Map<string, any>(),
};

/**
 * Universal Database Layer with Production Security Enforcement
 */
export const db = {
  // -------------------------------------------------------------
  // RESUMES
  // -------------------------------------------------------------
  async listResumes(userId: string | null, guestSessionId: string | null): Promise<ResumeRecord[]> {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      try {
        let query = supabase.from('resumes').select('*').order('updated_at', { ascending: false });
        if (userId) {
          query = query.eq('user_id', userId);
        } else if (guestSessionId) {
          query = query.eq('guest_session_id', guestSessionId);
        } else {
          return [];
        }

        const { data, error } = await query;
        if (!error && data) return data as ResumeRecord[];
      } catch (err) {
        if (process.env.NODE_ENV === 'production') {
          console.error('[SECURITY ERROR] Supabase query failed in production:', err);
        }
      }
    }

    // Memory Store fallback for development
    const results: ResumeRecord[] = [];
    memoryDb.resumes.forEach((rec) => {
      if (userId && rec.user_id === userId) {
        results.push(rec);
      } else if (!userId && guestSessionId && rec.guest_session_id === guestSessionId) {
        results.push(rec);
      }
    });

    return results.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },

  async getResume(id: string, userId: string | null, guestSessionId: string | null): Promise<ResumeRecord | null> {
    if (!id || typeof id !== 'string') return null;

    const supabase = getSupabaseServerClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('resumes').select('*').eq('id', id).single();
        if (!error && data) {
          const rec = data as ResumeRecord;
          // STRICT SECURITY VALIDATION: User ownership OR exact guest session match
          const isOwner =
            (userId && rec.user_id === userId) ||
            (!userId && guestSessionId && rec.guest_session_id === guestSessionId);

          if (isOwner) {
            const { data: messages } = await supabase
              .from('chat_messages')
              .select('*')
              .eq('resume_id', id)
              .order('created_at', { ascending: true });

            const { data: versions } = await supabase
              .from('resume_versions')
              .select('*')
              .eq('resume_id', id)
              .order('created_at', { ascending: false });

            rec.chat_messages = messages || [];
            rec.version_history = versions || [];
            return rec;
          }
          return null; // Unauthorized
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'production') {
          console.error('[SECURITY ERROR] Supabase getResume error:', err);
        }
      }
    }

    // Memory Store fallback
    const rec = memoryDb.resumes.get(id);
    if (!rec) return null;

    const isOwner =
      (userId && rec.user_id === userId) ||
      (!userId && guestSessionId && rec.guest_session_id === guestSessionId);

    if (isOwner) {
      const messages = memoryDb.conversations.get(id) || [];
      const versions = memoryDb.versions.get(id) || [];
      return { ...rec, chat_messages: messages, version_history: versions };
    }

    return null; // Unauthorized
  },

  async createResume(
    payload: {
      id?: string;
      title?: string;
      data?: ResumeData;
      design?: DesignConfig;
    },
    userId: string | null,
    guestSessionId: string | null
  ): Promise<ResumeRecord> {
    const id = payload.id || 'res_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
    const title = payload.title || payload.data?.title || 'My Professional CV';
    const data = payload.data || JSON.parse(JSON.stringify(initialResumeData));
    const design = payload.design || JSON.parse(JSON.stringify(initialDesignConfig));
    const now = new Date().toISOString();

    const newRecord: ResumeRecord = {
      id,
      user_id: userId,
      guest_session_id: userId ? null : guestSessionId,
      title: title.slice(0, 150), // Bound length
      data,
      design,
      is_paid: false, // NEVER allow client to mark as paid on creation!
      created_at: now,
      updated_at: now,
    };

    const supabase = getSupabaseServerClient();
    if (supabase) {
      try {
        await supabase.from('resumes').insert(newRecord);
      } catch (err) {
        console.warn('Supabase createResume error:', err);
      }
    }

    memoryDb.resumes.set(id, newRecord);
    return newRecord;
  },

  async updateResume(
    id: string,
    payload: {
      title?: string;
      data?: ResumeData;
      design?: DesignConfig;
      version_history?: any[];
      chat_messages?: ChatMessage[];
    },
    userId: string | null,
    guestSessionId: string | null
  ): Promise<ResumeRecord | null> {
    const existing = await this.getResume(id, userId, guestSessionId);
    if (!existing) return null; // Forbidden or Not Found

    const now = new Date().toISOString();
    
    // SECURITY: Discard any client-supplied 'is_paid', 'isPaid', 'user_id', or 'id'
    const updated: ResumeRecord = {
      ...existing,
      title: payload.title !== undefined ? String(payload.title).slice(0, 150) : existing.title,
      data: payload.data !== undefined ? payload.data : existing.data,
      design: payload.design !== undefined ? payload.design : existing.design,
      is_paid: existing.is_paid, // KEEP existing verified server payment status!
      updated_at: now,
    };

    const supabase = getSupabaseServerClient();
    if (supabase) {
      try {
        await supabase
          .from('resumes')
          .update({
            title: updated.title,
            data: updated.data,
            design: updated.design,
            updated_at: now,
          })
          .eq('id', id);

        if (payload.version_history && payload.version_history.length > 0) {
          const v = payload.version_history[0];
          await supabase.from('resume_versions').upsert({
            id: v.id || 'v-' + Date.now(),
            resume_id: id,
            description: v.description || 'Auto-save update',
            data: v.data || updated.data,
            design: v.design || updated.design,
            created_at: now,
          });
        }

        if (payload.chat_messages && payload.chat_messages.length > 0) {
          const latestMsg = payload.chat_messages[payload.chat_messages.length - 1];
          await supabase.from('chat_messages').upsert({
            id: latestMsg.id,
            resume_id: id,
            role: latestMsg.role,
            content: latestMsg.content,
            diff_preview: latestMsg.diffPreview || null,
            suggested_actions: latestMsg.suggestedActions || null,
            created_at: now,
          });
        }
      } catch (err) {
        console.warn('Supabase updateResume error:', err);
      }
    }

    memoryDb.resumes.set(id, updated);
    if (payload.version_history) memoryDb.versions.set(id, payload.version_history);
    if (payload.chat_messages) memoryDb.conversations.set(id, payload.chat_messages);

    return updated;
  },

  async deleteResume(id: string, userId: string | null, guestSessionId: string | null): Promise<boolean> {
    const existing = await this.getResume(id, userId, guestSessionId);
    if (!existing) return false;

    const supabase = getSupabaseServerClient();
    if (supabase) {
      try {
        await supabase.from('resumes').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteResume error:', err);
      }
    }

    memoryDb.resumes.delete(id);
    memoryDb.versions.delete(id);
    memoryDb.conversations.delete(id);
    return true;
  },

  /**
   * Automatically migrates all guest CVs created under a guest_session_id to a newly signed in/registered user.
   * Clears guest_session_id so old guest session can no longer access migrated CVs!
   */
  async claimGuestResumes(guestSessionId: string, userId: string): Promise<number> {
    let claimedCount = 0;
    const supabase = getSupabaseServerClient();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('resumes')
          .update({ user_id: userId, guest_session_id: null })
          .eq('guest_session_id', guestSessionId)
          .select();

        claimedCount = data?.length || 0;
      } catch (err) {
        console.warn('Supabase claimGuestResumes error:', err);
      }
    }

    memoryDb.resumes.forEach((rec, id) => {
      if (rec.guest_session_id === guestSessionId) {
        rec.user_id = userId;
        rec.guest_session_id = null; // Clear guest ID so old guest session is invalidated
        memoryDb.resumes.set(id, rec);
        claimedCount++;
      }
    });

    return claimedCount;
  },

  // -------------------------------------------------------------
  // USERS & AUTH
  // -------------------------------------------------------------
  async findUserByEmail(email: string): Promise<UserRecord | null> {
    const cleanEmail = email.toLowerCase().trim();
    const supabase = getSupabaseServerClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('email', cleanEmail).single();
        if (!error && data) return data as UserRecord;
      } catch (err) {
        // Fallback to memory
      }
    }

    return memoryDb.users.get(cleanEmail) || null;
  },

  async findUserById(id: string): Promise<UserRecord | null> {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
        if (!error && data) return data as UserRecord;
      } catch (err) {
        // Fallback
      }
    }

    for (const u of memoryDb.users.values()) {
      if (u.id === id) return u;
    }
    return null;
  },

  async createUser(email: string, passwordHash: string, fullName?: string): Promise<UserRecord> {
    const cleanEmail = email.toLowerCase().trim();
    const id = 'usr_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
    const now = new Date().toISOString();

    const user: UserRecord = {
      id,
      email: cleanEmail,
      password_hash: passwordHash,
      full_name: (fullName || cleanEmail.split('@')[0]).slice(0, 100),
      created_at: now,
    };

    const supabase = getSupabaseServerClient();
    if (supabase) {
      try {
        await supabase.from('users').insert(user);
      } catch (err) {
        console.warn('Supabase createUser error:', err);
      }
    }

    memoryDb.users.set(cleanEmail, user);
    return user;
  },

  // -------------------------------------------------------------
  // PAYMENTS (SERVER-SIDE ONLY)
  // -------------------------------------------------------------
  async markResumePaid(resumeId: string, userId: string | null, guestSessionId: string | null): Promise<boolean> {
    const rec = memoryDb.resumes.get(resumeId);
    if (rec) {
      rec.is_paid = true;
      memoryDb.resumes.set(resumeId, rec);
    }

    const supabase = getSupabaseServerClient();
    if (supabase) {
      try {
        await supabase.from('resumes').update({ is_paid: true }).eq('id', resumeId);
        await supabase.from('payments').insert({
          id: 'pay_' + Date.now(),
          resume_id: resumeId,
          user_id: userId,
          guest_session_id: guestSessionId,
          amount: 50.0,
          currency: 'BDT',
          status: 'completed',
          payment_method: 'bKash',
        });
      } catch (err) {
        console.warn('Supabase markResumePaid error:', err);
      }
    }

    return true;
  },
};
