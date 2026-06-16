export interface SavedDesign {
  id: string;
  templateId: string;
  templateName: string;
  wallColorId: string;
  wallColorHex: string;
  floorFinishId: string;
  floorFinishName: string;
  furniture: Array<{
    id: string;
    type: string;
    x: number; // percentage width
    y: number; // percentage height
    color?: string;
    scale?: number;
  }>;
  createdAt: string;
}

export interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  details: string;
  createdAt: string;
}

class MockSupabaseClient {
  private getStorage<T>(key: string): T[] {
    const data = localStorage.getItem(`supabase_mock_${key}`);
    return data ? JSON.parse(data) : [];
  }

  private setStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(`supabase_mock_${key}`, JSON.stringify(data));
  }

  from(table: 'saved_designs' | 'consultation_requests') {
    return {
      select: async (): Promise<{ data: any[] | null; error: Error | null }> => {
        try {
          const list = this.getStorage(table);
          // sort descending by date
          list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return { data: list, error: null };
        } catch (err) {
          return { data: null, error: err as Error };
        }
      },

      insert: async (row: any): Promise<{ data: any | null; error: Error | null }> => {
        try {
          const list = this.getStorage(table);
          const newRow = {
            id: Math.random().toString(36).substring(2, 11),
            createdAt: new Date().toISOString(),
            ...row,
          };
          list.push(newRow);
          this.setStorage(table, list);
          console.log(`[Supabase Mock] Inserted into ${table}:`, newRow);
          return { data: newRow, error: null };
        } catch (err) {
          return { data: null, error: err as Error };
        }
      },

      delete: async (id: string): Promise<{ success: boolean; error: Error | null }> => {
        try {
          const list = this.getStorage(table);
          const filtered = list.filter((item: any) => item.id !== id);
          this.setStorage(table, filtered);
          console.log(`[Supabase Mock] Deleted from ${table} ID:`, id);
          return { success: true, error: null };
        } catch (err) {
          return { success: false, error: err as Error };
        }
      }
    };
  }
}

export const supabaseMock = new MockSupabaseClient();
