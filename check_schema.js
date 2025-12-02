
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            if (key.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value.trim().replace(/"/g, '');
            if (key.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseAnonKey = value.trim().replace(/"/g, '');
        }
    });
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    // Try to select user_id and status from products
    const { data, error } = await supabase
        .from('products')
        .select('user_id, status')
        .limit(1);

    if (error) {
        console.log('Error selecting columns:', error.message);
    } else {
        console.log('Columns exist. Data:', data);
    }
}

checkSchema();
