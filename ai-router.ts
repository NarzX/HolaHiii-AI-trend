import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

export const aiRouter = createRouter({
  analyzeTrend: publicQuery
    .input(
      z.object({
        title: z.string(),
        platform: z.string(),
        views: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const analyses: Record<string, string> = {
        dance: `**Analisis Tren Dance** 🕺\n\n**Faktor Viral Utama:**\n• Musik yang catchy dan mudah diingat membuat orang ingin ikut berpartisipasi\n• Gerakan yang sederhana tapi unik - tidak perlu skill dance profesional\n• Efek visual yang menarik perhatian dalam 3 detik pertama\n\n**Target Audiens:**\n• Usia 16-28 tahun (Gen Z dan young millennials)\n• Pengguna aktif TikTok yang suka berpartisipasi dalam challenge\n\n**Rekomendasi Strategi Konten:**\n1. **Hook 3 Detik Pertama** - Mulai dengan gerakan paling ikonik\n2. **Gunakan Trending Audio** - Pilih musik yang sedang viral\n3. **Tambahkan Twist Unik** - Variasi gerakan atau lokasi yang menarik\n4. **Collaborate** - Duets dengan creator lain untuk jangkauan lebih luas\n\n**Prediksi:** Tren ini akan bertahan 2-3 minggu lagi sebelum turun. Waktu terbaik untuk ikut adalah SEKARANG! 🔥`,

        comedy: `**Analisis Tren Komedi** 😂\n\n**Faktor Viral Utama:**\n• Konten yang sangat relatable dengan pengalaman sehari-hari\n• Setup yang singkat dan punchline yang tak terduga\n• Ekspresi wajah yang berlebihan dan lucu\n\n**Target Audiens:**\n• Usia 18-35 tahun\n• Pengguna yang mencari hiburan ringan saat istirahat\n\n**Rekomendasi Strategi Konten:**\n1. **POV Format** - Gunakan sudut pandang yang unik dan unexpected\n2. **Relatable Content** - Ceritakan pengalaman yang banyak orang rasakan\n3. **Timing adalah Kunci** - Punchline harus cepat dan tepat\n4. **Visual Comedy** - Manfaatkan ekspresi dan gesture\n\n**Prediksi:** Tren komedi POV akan terus berkembang dengan variasi baru. Potensi viral tinggi! 📈`,

        cooking: `**Analisis Tren Cooking** 👨‍🍳\n\n**Faktor Viral Utama:**\n• Resep yang sangat sederhana (3 bahan) - low barrier to try\n• Visual makanan yang menggugah selera\n• Hasil akhir yang satisfying dan aesthetic\n\n**Target Audiens:**\n• Usia 20-40 tahun\n• Foodies dan home cooks\n• Orang yang mencari ide masakan praktis\n\n**Rekomendasi Strategi Konten:**\n1. **Satisfying Visuals** - Fokus pada tekstur dan warna makanan\n2. **ASMR Elements** - Suara memasak yang satisfying\n3. **Quick Format** - 15-30 detik, straight to the point\n4. **Before-After** - Tunjukkan transformasi yang dramatis\n\n**Prediksi:** Tren masak simpel akan terus diminati. Variasi dengan bahan unik akan viral! 🍳`,

        gaming: `**Analisis Tren Gaming** 🎮\n\n**Faktor Viral Utama:**\n• Skill level yang mengagumkan - "impossible" untuk rata-rata pemain\n• Ketegangan dan anticipation yang dibangun sepanjang video\n• Community engagement yang tinggi (comments, shares)\n\n**Target Audiens:**\n• Usia 14-28 tahun\n• Gamers casual dan hardcore\n• Peniksa konten entertainment\n\n**Rekomendasi Strategi Konten:**\n1. **Highlight Reel** - Tampilkan momen paling epic\n2. **Reaction Format** - Tunjukkan reaksi saat berhasil/gagal\n3. **Tutorial Element** - Jelaskan teknik yang digunakan\n4. **Challenge Others** - Tantang viewer untuk mencoba\n\n**Prediksi:** Speedrun dan gameplay skills akan terus populer. Game baru = opportunity baru! 🏆`,

        beauty: `**Analisis Tren Beauty** 💄\n\n**Faktor Viral Utama:**\n• Transformasi yang drastis dan memukau\n• Before-after yang kontras\n• Tutorial yang mudah diikuti\n\n**Target Audiens:**\n• Usia 16-32 tahun\n• Beauty enthusiasts\n• Orang yang mencari tips makeup\n\n**Rekomendasi Strategi Konten:**\n1. **Transformation Hook** - Mulai dengan wajah tanpa makeup\n2. **Step-by-Step** - Jelaskan setiap step dengan jelas\n3. **Product Mention** - Sebut produk yang digunakan\n4. **Final Reveal** - Ending yang satisfying dengan hasil flawless\n\n**Prediksi:** Konten makeup tutorial akan selalu ada. Fokus pada produk lokal untuk engagement lebih tinggi! ✨`,

        music: `**Analisis Tren Music** 🎵\n\n**Faktor Viral Utama:**\n• Song choice yang nostalgic dan emosional\n• Arrangement yang unik (akustik, remix)\n• Vocal quality yang outstanding\n\n**Target Audiens:**\n• Usia 18-45 tahun\n• Music lovers\n• Penggemar lagu-lagu nostalgia\n\n**Rekomendasi Strategi Konten:**\n1. **Emotional Connection** - Pilih lagu yang punya makna\n2. **Unique Arrangement** - Berikan sentuhan berbeda\n3. **Visual Storytelling** - Setting yang mendukung mood lagu\n4. **Short Cover** - 30-60 detik untuk attention span pendek\n\n**Prediksi:** Cover lagu akan terus populer. Lagu Indonesia 2000an sedang naik daun! 🎸`,

        fashion: `**Analisis Tren Fashion** 👗\n\n**Faktor Viral Utama:**\n• Outfit yang achievable dan affordable\n• Mix & match yang kreatif\n• Representation lokal (Jakarta street style)\n\n**Target Audiens:**\n• Usia 18-30 tahun\n• Fashion-conscious individuals\n• Urban youth\n\n**Rekomendasi Strategi Konten:**\n1. **OOTD Format** - Show full outfit dari head to toe\n2. **Affordable Fashion** - Highlight brand lokal/murah\n3. **Transition** - Gunakan transisi kreatif\n4. **Caption Tips** - Share styling tips di caption\n\n**Prediksi:** Local street style akan terus naik. Sustainable fashion juga mulai trending! 👟`,

        travel: `**Analisis Tren Travel** ✈️\n\n**Faktor Viral Utama:**\n• Destinasi yang belum terlalu dikenal (hidden gem)\n• Cinematography yang stunning\n• Informasi praktis yang berguna\n\n**Target Audiens:**\n• Usia 22-40 tahun\n• Travel enthusiasts\n• Weekend warriors\n\n**Rekomendasi Strategi Konten:**\n1. **Cinematic Opening** - 3 detik pertama harus WOW\n2. **Practical Info** - Share lokasi, budget, tips\n3. **Storytelling** - Ceritakan pengalaman, bukan cuma show tempat\n4. **Drone Shots** - Aerial view selalu menarik\n\n**Prediksi:** Hidden gems dan budget travel akan terus diminati. Domestic travel masih king! 🏔️`,

        technology: `**Analisis Tren Tech** 📱\n\n**Faktor Viral Utama:**\n• Gadget baru yang hype\n• Review yang jujur dan detail\n• Comparison yang membantu decision-making\n\n**Target Audiens:**\n• Usia 20-40 tahun\n• Tech enthusiasts\n• Calon pembeli gadget\n\n**Rekomendasi Strategi Konten:**\n1. **Unboxing Experience** - First impression matters\n2. **Real Usage** - Show penggunaan sehari-hari\n3. **Pros & Cons** - Jujur itu penting\n4. **Comparison** - Bandingkan dengan produk sejenis\n\n**Prediksi:** Review gadget akan selalu dicari. Fokus pada value for money! 💡`,

        default: `**Analisis Tren Konten** 📊\n\n**Faktor Viral Utama:**\n• Konten yang autentik dan original\n• Timing yang tepat saat tren sedang naik\n• Engagement dengan komunitas\n\n**Target Audiens:**\n• Bergantung pada niche konten\n• Umumnya usia 16-35 tahun\n\n**Rekomendasi Strategi Konten:**\n1. **Authenticity** - Jadilah diri sendiri\n2. **Consistency** - Post secara teratur\n3. **Engage** - Balas comments dan buat community\n4. **Adapt** - Ikuti tren tapi tambahkan twist unikmu\n\n**Prediksi:** Konten yang genuine akan selalu menang di long term. Jangan ikut tren tanpa personal touch! 🌟`,
      };

      const categoryKey = input.category || "default";
      const analysis = analyses[categoryKey] || analyses.default;

      return {
        analysis,
        recommendations: [
          "Buat konten sekarang saat tren masih naik",
          "Gunakan hashtag yang relevan untuk maksimalkan jangkauan",
          "Collaborate dengan creator lain di niche yang sama",
          "Analisis kompetitor untuk temukan celah unik",
        ],
      };
    }),

  getRecommendations: publicQuery
    .input(
      z.object({
        platform: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async () => {
      const recommendations = [
        {
          title: "Duet/Reaction Video",
          desc: "Buat video reaction atau duet dengan konten viral yang sedang trending",
          potential: "High",
        },
        {
          title: "Behind the Scenes",
          desc: "Tunjukkan proses di balik pembuatan konten populer",
          potential: "Medium",
        },
        {
          title: "Tutorial/How-To",
          desc: "Jelaskan cara melakukan sesuatu yang sedang viral",
          potential: "High",
        },
        {
          title: "Comparison Content",
          desc: "Bandingkan tren lama vs tren baru untuk spark debate",
          potential: "Medium",
        },
        {
          title: "Challenge Variation",
          desc: "Buat variasi unik dari challenge yang sedang viral",
          potential: "High",
        },
      ];

      return {
        recommendations,
        reasons: [
          "Tren ini sedang naik dengan pertumbuhan views 200%+ dalam 7 hari terakhir",
          "Target audience yang besar dan engaged",
          "Konten yang relatable dan mudah diikuti",
          "Potensi untuk trigger user-generated content",
        ],
      };
    }),

  generateContentIdeas: publicQuery
    .input(
      z.object({
        topic: z.string(),
        platform: z.string(),
        count: z.number().min(1).max(10).default(5),
      })
    )
    .mutation(async ({ input }) => {
      const ideas = [
        `"5 ${input.topic} Terbaik Bulan Ini" - Compilation/Reaction format`,
        `"Cara Membuat ${input.topic} Viral" - Tutorial step-by-step`,
        `"${input.topic} Fail Compilation" - Humor + entertainment`,
        `"Behind the Scenes: ${input.topic}" - Exclusive content`,
        `"${input.topic} Challenge" - Create your own challenge`,
        `"${input.topic} vs [Competitor]" - Comparison video`,
        `"Sejarah ${input.topic}" - Educational storytelling`,
        `"${input.topic} Hacks" - Tips & tricks format`,
        `"Review ${input.topic} Terbaru" - Honest review`,
        `"${input.topic} Transformation" - Before/after format`,
      ];

      return {
        ideas: ideas.slice(0, input.count).map((idea, idx) => ({
          id: idx + 1,
          title: idea,
          format: ["Video 15-30 detik", "Reels/Shorts", "Carousel Post", "Live Stream", "Story Series"][idx % 5],
          hashtags: [`#${input.topic.replace(/\s/g, "")}`, `#${input.platform}`, `#viral`, `#trending${new Date().getFullYear()}`],
        })),
      };
    }),
});
