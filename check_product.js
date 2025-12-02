
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

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixCategory() {
    // First find the product to confirm
    const { data: products, error: searchError } = await supabase
        .from('products')
        .select('*')
        .ilike('title', '%setsetset%');

    if (searchError) {
        console.error('Error searching product:', searchError);
        return;
    }

    if (!products || products.length === 0) {
        console.log('Product "setsetset" not found.');
        return;
    }

    console.log('Found products:', products);

    // Update the category to 'etc' (기타 중고물품)
    for (const product of products) {
        const { error: updateError } = await supabase
            .from('products')
            .update({ category: 'etc' })
            .eq('id', product.id);

        if (updateError) {
            console.error(`Error updating product ${product.id}:`, updateError);
        } else {
            console.log(`Updated product ${product.id} category to 'etc'.`);
        }
    }
}

fixCategory();
