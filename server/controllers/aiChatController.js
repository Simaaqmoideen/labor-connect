const { AIChatHistory, Worker, JobRequest, JobProvider } = require('../models');
const { Op } = require('sequelize');

// Multi-language responses
const RESPONSES = {
  en: {
    greeting: "Hello! I'm your Labor Connect AI Assistant 🤖 How can I help you today?",
    no_understand: "I didn't quite understand that. Try commands like: 'find electricians', 'show my earnings', 'find jobs near me'",
    no_workers: "No workers found matching your criteria.",
    no_jobs: "No jobs found at the moment.",
    error: "Sorry, something went wrong. Please try again.",
    help_employer: "I can help you with:\n• Find nearby workers (e.g., 'find electricians')\n• Recommend best workers\n• Show available workers\n• Estimate project cost\n• Check weather for job",
    help_worker: "I can help you with:\n• Find jobs near me\n• Show my earnings\n• Show upcoming work\n• Check my level\n• Show my ratings"
  },
  hi: {
    greeting: "नमस्ते! मैं लेबर कनेक्ट AI असिस्टेंट हूं 🤖 आज मैं आपकी कैसे मदद कर सकता हूं?",
    no_understand: "मुझे समझ नहीं आया। कृपया कमांड आज़माएं जैसे: 'इलेक्ट्रीशियन खोजें', 'मेरी कमाई दिखाएं'",
    no_workers: "आपकी खोज से मेल खाने वाले कोई कामगार नहीं मिले।",
    no_jobs: "इस समय कोई नौकरी उपलब्ध नहीं है।",
    error: "क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    help_employer: "मैं आपकी मदद कर सकता हूं:\n• आसपास के कामगार खोजें\n• सबसे अच्छे कामगार की सिफारिश\n• उपलब्ध कामगार दिखाएं\n• प्रोजेक्ट लागत अनुमान",
    help_worker: "मैं आपकी मदद कर सकता हूं:\n• मेरे पास की नौकरियां खोजें\n• मेरी कमाई दिखाएं\n• आगामी काम दिखाएं\n• मेरा स्तर जांचें"
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ! ನಾನು ಲೇಬರ್ ಕನೆಕ್ಟ್ AI ಸಹಾಯಕ 🤖 ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    no_understand: "ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. 'ಎಲೆಕ್ಟ್ರೀಷಿಯನ್ ಹುಡುಕಿ', 'ನನ್ನ ಗಳಿಕೆ ತೋರಿಸಿ' ನಂತಹ ಆದೇಶಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ",
    no_workers: "ನಿಮ್ಮ ಮಾನದಂಡಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುವ ಕೆಲಸಗಾರರು ಕಂಡುಬಂದಿಲ್ಲ.",
    no_jobs: "ಪ್ರಸ್ತುತ ಯಾವುದೇ ಕೆಲಸಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    error: "ಕ್ಷಮಿಸಿ, ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    help_employer: "ನಾನು ಸಹಾಯ ಮಾಡಬಹುದು:\n• ಹತ್ತಿರದ ಕೆಲಸಗಾರರನ್ನು ಹುಡುಕಿ\n• ಉತ್ತಮ ಕೆಲಸಗಾರರ ಶಿಫಾರಸು\n• ಲಭ್ಯವಿರುವ ಕೆಲಸಗಾರರನ್ನು ತೋರಿಸಿ",
    help_worker: "ನಾನು ಸಹಾಯ ಮಾಡಬಹುದು:\n• ಹತ್ತಿರದ ಕೆಲಸಗಳನ್ನು ಹುಡುಕಿ\n• ನನ್ನ ಗಳಿಕೆ ತೋರಿಸಿ\n• ಮುಂಬರುವ ಕೆಲಸ ತೋರಿಸಿ"
  },
  ta: {
    greeting: "வணக்கம்! நான் லேபர் கனெக்ட் AI உதவியாளர் 🤖 இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
    no_understand: "எனக்கு புரியவில்லை. 'எலெக்ட்ரீசியன் கண்டுபிடி', 'எனது வருமானம் காட்டு' போன்ற கட்டளைகளை முயற்சிக்கவும்",
    no_workers: "உங்கள் அளவுகோலுக்கு பொருந்தும் தொழிலாளர்கள் கிடைக்கவில்லை.",
    no_jobs: "தற்போது வேலைகள் எதுவும் கிடைக்கவில்லை.",
    error: "மன்னிக்கவும், ஏதோ தவறு ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
    help_employer: "நான் உதவ முடியும்:\n• அருகிலுள்ள தொழிலாளர்களை கண்டுபிடி\n• சிறந்த தொழிலாளர்களை பரிந்துரை\n• கிடைக்கும் தொழிலாளர்களை காட்டு",
    help_worker: "நான் உதவ முடியும்:\n• அருகிலுள்ள வேலைகளை கண்டுபிடி\n• எனது வருமானம் காட்டு\n• வரவிருக்கும் வேலை காட்டு"
  },
  te: {
    greeting: "నమస్కారం! నేను లేబర్ కనెక్ట్ AI అసిస్టెంట్ 🤖 ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
    no_understand: "నాకు అర్ధం కాలేదు. 'ఎలక్ట్రీషియన్ కనుగొనండి', 'నా సంపాదన చూపించు' వంటి ఆదేశాలను ప్రయత్నించండి",
    no_workers: "మీ ప్రమాణాలకు సరిపోయే కార్మికులు కనుగొనబడలేదు.",
    no_jobs: "ప్రస్తుతం ఉద్యోగాలు ఏవీ కనుగొనబడలేదు.",
    error: "క్షమించండి, ఏదో తప్పు జరిగింది. మళ్ళీ ప్రయత్నించండి.",
    help_employer: "నేను సహాయం చేయగలను:\n• సమీపంలోని కార్మికులను కనుగొనండి\n• ఉత్తమ కార్మికులను సిఫారసు\n• అందుబాటులో ఉన్న కార్మికులను చూపించు",
    help_worker: "నేను సహాయం చేయగలను:\n• సమీపంలోని ఉద్యోగాలను కనుగొనండి\n• నా సంపాదన చూపించు\n• రాబోయే పనిని చూపించు"
  },
  ml: {
    greeting: "നമസ്കാരം! ഞാൻ ലേബർ കണക്ട് AI അസിസ്റ്റന്റ് 🤖 ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും?",
    no_understand: "എനിക്ക് മനസ്സിലായില്ല. 'ഇലക്ട്രീഷ്യൻ കണ്ടെത്തുക', 'എന്റെ വരുമാനം കാണിക്കുക' പോലുള്ള കമാൻഡുകൾ ശ്രമിക്കുക",
    no_workers: "നിങ്ങളുടെ മാനദണ്ഡങ്ങൾക്ക് അനുയോജ്യമായ തൊഴിലാളികളെ കണ്ടെത്തിയില്ല.",
    no_jobs: "നിലവിൽ ജോലികൾ ഒന്നും കണ്ടെത്തിയില്ല.",
    error: "ക്ഷമിക്കണം, എന്തോ പിശക് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.",
    help_employer: "എനിക്ക് സഹായിക്കാൻ കഴിയും:\n• അടുത്തുള്ള തൊഴിലാളികളെ കണ്ടെത്തുക\n• മികച്ച തൊഴിലാളികളെ ശുപാർശ\n• ലഭ്യമായ തൊഴിലാളികളെ കാണിക്കുക",
    help_worker: "എനിക്ക് സഹായിക്കാൻ കഴിയും:\n• അടുത്തുള്ള ജോലികൾ കണ്ടെത്തുക\n• എന്റെ വരുമാനം കാണിക്കുക\n• വരാനിരിക്കുന്ന ജോലി കാണിക്കുക"
  }
};

// Command patterns
const COMMANDS = {
  find_workers: /(?:find|search|show|get|recommend|best|nearby)\s*(?:nearby\s*)?(?:electrician|plumber|carpenter|painter|mason|helper|worker|labor)/i,
  available_workers: /(?:show|list|get)\s*(?:available|free|online)\s*worker/i,
  estimate_cost: /(?:estimate|calculate|how much)\s*(?:project\s*)?(?:cost|price|budget)/i,
  find_jobs: /(?:find|search|show|get)\s*(?:nearby\s*)?(?:job|work)\s*(?:near\s*me)?/i,
  show_earnings: /(?:show|my|get|view)\s*(?:earning|income|salary|payment)/i,
  upcoming_work: /(?:show|my|get|view)\s*(?:upcoming|next|scheduled|pending)\s*(?:work|job)/i,
  check_level: /(?:show|my|get|check|view)\s*(?:level|rank|status|progress)/i,
  show_ratings: /(?:show|my|get|view)\s*(?:rating|review|feedback)/i,
  help: /(?:help|commands|what can you do|how to use|guide|menu)/i,
  greeting: /(?:^hi$|^hello$|^hey$|^namaste$|^vanakkam$|^namaskara$)/i
};

function extractCategory(msg) {
  const cats = ['electrician', 'plumber', 'carpenter', 'painter', 'mason', 'helper'];
  const lower = msg.toLowerCase();
  return cats.find(c => lower.includes(c)) || null;
}

const processMessage = async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    const userRole = req.user.role;
    const userId = req.user.id;
    const lang = RESPONSES[language] || RESPONSES.en;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const msg = message.trim();
    let response = '';
    let data = null;

    // Greeting
    if (COMMANDS.greeting.test(msg)) {
      response = lang.greeting;
    }
    // Help
    else if (COMMANDS.help.test(msg)) {
      response = userRole === 'provider' ? lang.help_employer : lang.help_worker;
    }
    // Find Workers (Employer)
    else if (COMMANDS.find_workers.test(msg) && userRole === 'provider') {
      const category = extractCategory(msg);
      const where = { is_suspended: false, availability: 'available' };
      if (category) where.category = { [Op.like]: `%${category}%` };

      const workers = await Worker.findAll({
        where,
        attributes: ['id', 'name', 'category', 'rating_avg', 'wage_per_day', 'experience_yrs', 'level'],
        order: [
          ['level', 'DESC'],
          ['rating_avg', 'DESC']
        ],
        limit: 5
      });

      if (workers.length === 0) {
        response = lang.no_workers;
      } else {
        const levelEmoji = { platinum: '💎', gold: '🥇', silver: '🥈', bronze: '🥉' };
        response = `Found ${workers.length} ${category || ''} workers:\n\n` +
          workers.map((w, i) => `${i + 1}. ${levelEmoji[w.level] || '🥉'} ${w.name} — ${w.category}\n   ⭐ ${w.rating_avg} | ₹${w.wage_per_day}/day | ${w.experience_yrs} yrs exp`).join('\n\n');
        data = { type: 'workers', workers };
      }
    }
    // Available Workers (Employer)
    else if (COMMANDS.available_workers.test(msg) && userRole === 'provider') {
      const count = await Worker.count({ where: { availability: 'available', is_suspended: false } });
      response = `There are ${count} workers currently available and online. Use 'find electrician' or similar to search by category.`;
    }
    // Estimate Cost (Employer)
    else if (COMMANDS.estimate_cost.test(msg) && userRole === 'provider') {
      const category = extractCategory(msg);
      const where = { is_suspended: false };
      if (category) where.category = { [Op.like]: `%${category}%` };

      const workers = await Worker.findAll({ where, attributes: ['wage_per_day'] });
      if (workers.length === 0) {
        response = lang.no_workers;
      } else {
        const wages = workers.map(w => parseFloat(w.wage_per_day));
        const avg = Math.round(wages.reduce((a, b) => a + b, 0) / wages.length);
        const min = Math.min(...wages);
        const max = Math.max(...wages);
        response = `💰 Cost Estimate ${category ? `for ${category}` : ''}:\n\n` +
          `Average: ₹${avg}/day\nRange: ₹${min} — ₹${max}/day\nBased on ${workers.length} workers in the system.`;
      }
    }
    // Find Jobs (Worker)
    else if (COMMANDS.find_jobs.test(msg) && userRole === 'worker') {
      const jobs = await JobRequest.findAll({
        where: { worker_id: userId, status: 'pending' },
        include: [{ model: JobProvider, attributes: ['name', 'company_name'] }],
        order: [['created_at', 'DESC']],
        limit: 5
      });

      if (jobs.length === 0) {
        response = lang.no_jobs;
      } else {
        response = `📋 You have ${jobs.length} pending job requests:\n\n` +
          jobs.map((j, i) => `${i + 1}. ${j.title}\n   From: ${j.JobProvider?.name || 'Unknown'} | ₹${j.expected_wage}`).join('\n\n');
        data = { type: 'jobs', jobs };
      }
    }
    // Show Earnings (Worker)
    else if (COMMANDS.show_earnings.test(msg) && userRole === 'worker') {
      const completed = await JobRequest.findAll({
        where: { worker_id: userId, status: 'completed' },
        attributes: ['expected_wage', 'completed_at']
      });

      const total = completed.reduce((sum, j) => sum + (parseFloat(j.expected_wage) || 0), 0);
      const thisMonth = completed.filter(j => {
        const d = new Date(j.completed_at);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).reduce((sum, j) => sum + (parseFloat(j.expected_wage) || 0), 0);

      response = `💰 Your Earnings:\n\nTotal: ₹${total}\nThis Month: ₹${thisMonth}\nJobs Completed: ${completed.length}`;
    }
    // Upcoming Work (Worker)
    else if (COMMANDS.upcoming_work.test(msg) && userRole === 'worker') {
      const upcoming = await JobRequest.findAll({
        where: { worker_id: userId, status: 'accepted' },
        include: [{ model: JobProvider, attributes: ['name'] }],
        order: [['scheduled_at', 'ASC']],
        limit: 5
      });

      if (upcoming.length === 0) {
        response = 'No upcoming work scheduled at the moment.';
      } else {
        response = `📅 Upcoming Work:\n\n` +
          upcoming.map((j, i) => {
            const date = j.scheduled_at ? new Date(j.scheduled_at).toLocaleDateString() : 'TBD';
            return `${i + 1}. ${j.title}\n   Date: ${date} | By: ${j.JobProvider?.name || 'Unknown'}`;
          }).join('\n\n');
      }
    }
    // Check Level (Worker)
    else if (COMMANDS.check_level.test(msg) && userRole === 'worker') {
      const worker = await Worker.findByPk(userId, {
        attributes: ['level', 'level_points', 'jobs_completed', 'rating_avg', 'reliability_score']
      });
      const levelEmoji = { platinum: '💎', gold: '🥇', silver: '🥈', bronze: '🥉' };
      response = `${levelEmoji[worker.level]} Your Level: ${worker.level.toUpperCase()}\n\n` +
        `Points: ${worker.level_points}\nJobs: ${worker.jobs_completed}\nRating: ⭐ ${worker.rating_avg}\nReliability: ${worker.reliability_score}%`;
    }
    // Show Ratings (Worker)
    else if (COMMANDS.show_ratings.test(msg) && userRole === 'worker') {
      const worker = await Worker.findByPk(userId, {
        attributes: ['rating_avg', 'rating_count']
      });
      response = `⭐ Your Ratings:\n\nAverage: ${worker.rating_avg}/5\nTotal Reviews: ${worker.rating_count}`;
    }
    // Default
    else {
      response = lang.no_understand;
    }

    // Save to history
    await AIChatHistory.create({
      user_id: userId,
      user_role: userRole,
      message: msg,
      response,
      language
    });

    res.json({ response, data, language });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const history = await AIChatHistory.findAll({
      where: { user_id: req.user.id, user_role: req.user.role },
      order: [['created_at', 'DESC']],
      limit: 50
    });
    res.json({ history: history.reverse() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { processMessage, getChatHistory };
