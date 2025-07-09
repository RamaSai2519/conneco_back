// services/supabase.ts
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { env } from "../config/env.ts";

class SupabaseService {
    private client: SupabaseClient;

    constructor() {
        this.client = createClient(
            env.supabaseUrl,
            env.supabaseServiceRoleKey
        );
    }

    get database() {
        return this.client;
    }
}

export const supabaseService = new SupabaseService();
