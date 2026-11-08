// import { supabase } from "@/lib/supabase/client";

// export const transactionRepository = {
//   async create(data: {
//     user_id: string;
//     category_id: string;
//     type: string;
//     amount: number;
//     date: string;
//     note?: string;
//   }) {
//     const { data: tx, error } = await supabase
//       .from("transactions")
//       .insert(data)
//       .select()
//       .single();
      
//     if (error) throw new Error(error.message);
//     return tx;
//   },

//   async findByUserId(userId: string) {
//     const { data, error } = await supabase
//       .from("transactions")
//       .select("*")
//       .eq("user_id", userId)
//       .order("date", { ascending: false });

//     if (error) throw new Error(error.message);
//     return data;
//   }
// };







































import { supabase } from "@/lib/supabase/client";
import { connectDB } from "@/lib/config/db";
import { Category } from "@/lib/models";

export const transactionRepository = {
  async create(data: {
    user_id: string;
    category_id: string;
    type: string;
    amount: number;
    date: string;
    note?: string;
  }) {
    const { data: tx, error } = await supabase
      .from("transactions")
      .insert(data)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return tx;
  },

  async findByUserId(userId: string) {
    // 1. Fetch from Supabase
    const { data: txs, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw new Error(error.message);
    if (!txs || txs.length === 0) return [];

    // 2. Fetch category names from MongoDB to join them
    await connectDB();
    const catIds = [...new Set(txs.map(t => t.category_id))];
    const categories = await Category.find({ _id: { $in: catIds } });
    
    // 3. Merge the data
    return txs.map(tx => {
      const cat = categories.find(c => c._id.toString() === tx.category_id);
      return {
        ...tx,
        category_name: cat ? cat.name : "Uncategorized"
      };
    });
  }
};