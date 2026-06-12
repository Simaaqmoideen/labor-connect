import json
import os

keys_to_add = {
    "en": {
        "status": "Status",
        "go_offline": "Go Offline",
        "go_online": "Go Online",
        "quick_stats": "Quick Stats",
        "total_earnings": "Total Earnings",
        "pending_jobs": "Pending Jobs",
        "level_points": "Level Points",
        "advanced_tools": "Advanced Tools",
        "find_accommodations": "Find Accommodations",
        "career_progress": "Career Progress",
        "incoming_requests": "Incoming Job Requests",
        "no_new_requests": "No new job requests at the moment.",
        "providers_near_you": "Job Providers Near You",
        "provider_label": "Provider:",
        "offered_wage": "Offered:",
        "required_date": "Required:"
    },
    "hi": {
        "status": "स्थिति",
        "go_offline": "ऑफ़लाइन जाएं",
        "go_online": "ऑनलाइन आएं",
        "quick_stats": "त्वरित आँकड़े",
        "total_earnings": "कुल कमाई",
        "pending_jobs": "लंबित कार्य",
        "level_points": "स्तर के अंक",
        "advanced_tools": "उन्नत उपकरण",
        "find_accommodations": "आवास खोजें",
        "career_progress": "करियर प्रगति",
        "incoming_requests": "आने वाले नौकरी के अनुरोध",
        "no_new_requests": "इस समय कोई नया नौकरी का अनुरोध नहीं है।",
        "providers_near_you": "आपके पास नौकरी प्रदाता",
        "provider_label": "प्रदाता:",
        "offered_wage": "प्रस्तावित:",
        "required_date": "आवश्यक:"
    },
    "kn": {
        "status": "ಸ್ಥಿತಿ",
        "go_offline": "ಆಫ್‌ಲೈನ್‌ಗೆ ಹೋಗಿ",
        "go_online": "ಆನ್‌ಲೈನ್‌ಗೆ ಬನ್ನಿ",
        "quick_stats": "ತ್ವರಿತ ಅಂಕಿಅಂಶಗಳು",
        "total_earnings": "ಒಟ್ಟು ಸಂಪಾದನೆ",
        "pending_jobs": "ಬಾಕಿ ಉಳಿದಿರುವ ಕೆಲಸಗಳು",
        "level_points": "ಮಟ್ಟದ ಅಂಕಗಳು",
        "advanced_tools": "ಸುಧಾರಿತ ಪರಿಕರಗಳು",
        "find_accommodations": "ವಸತಿಗಳನ್ನು ಹುಡುಕಿ",
        "career_progress": "ವೃತ್ತಿ ಪ್ರಗತಿ",
        "incoming_requests": "ಒಳಬರುವ ಉದ್ಯೋಗ ವಿನಂತಿಗಳು",
        "no_new_requests": "ಪ್ರಸ್ತುತ ಯಾವುದೇ ಹೊಸ ಉದ್ಯೋಗ ವಿನಂತಿಗಳಿಲ್ಲ.",
        "providers_near_you": "ನಿಮ್ಮ ಹತ್ತಿರದ ಉದ್ಯೋಗ ಒದಗಿಸುವವರು",
        "provider_label": "ಒದಗಿಸುವವರು:",
        "offered_wage": "ನೀಡಲಾಗಿದೆ:",
        "required_date": "ಅಗತ್ಯವಿದೆ:"
    },
    "ta": {
        "status": "நிலை",
        "go_offline": "ஆஃப்லைனுக்குச் செல்",
        "go_online": "ஆன்லைனில் வாருங்கள்",
        "quick_stats": "விரைவான புள்ளிவிவரங்கள்",
        "total_earnings": "மொத்த வருவாய்",
        "pending_jobs": "நிலுவையிலுள்ள வேலைகள்",
        "level_points": "நிலை புள்ளிகள்",
        "advanced_tools": "மேம்பட்ட கருவிகள்",
        "find_accommodations": "தங்குமிடங்களைக் கண்டறியவும்",
        "career_progress": "தொழில் முன்னேற்றம்",
        "incoming_requests": "உள்வரும் வேலை கோரிக்கைகள்",
        "no_new_requests": "தற்போதைக்கு புதிய வேலை கோரிக்கைகள் இல்லை.",
        "providers_near_you": "உங்கள் அருகில் உள்ள வேலை வழங்குநர்கள்",
        "provider_label": "வழங்குநர்:",
        "offered_wage": "வழங்கப்படுகிறது:",
        "required_date": "தேவை:"
    },
    "te": {
        "status": "స్థితి",
        "go_offline": "ఆఫ్‌లైన్‌కు వెళ్లండి",
        "go_online": "ఆన్‌లైన్‌కు రండి",
        "quick_stats": "శీఘ్ర గణాంకాలు",
        "total_earnings": "మొత్తం ఆదాయం",
        "pending_jobs": "పెండింగ్‌లో ఉన్న ఉద్యోగాలు",
        "level_points": "స్థాయి పాయింట్లు",
        "advanced_tools": "అధునాతన సాధనాలు",
        "find_accommodations": "వసతి కనుగొనండి",
        "career_progress": "కెరీర్ పురోగతి",
        "incoming_requests": "వస్తున్న ఉద్యోగ అభ్యర్థనలు",
        "no_new_requests": "ప్రస్తుతం కొత్త ఉద్యోగ అభ్యర్థనలు లేవు.",
        "providers_near_you": "మీ దగ్గర ఉన్న ఉద్యోగ ప్రదాతలు",
        "provider_label": "ప్రదాత:",
        "offered_wage": "అందించినది:",
        "required_date": "అవసరం:"
    },
    "ml": {
        "status": "പദവി",
        "go_offline": "ഓഫ്‌ലൈനിലേക്ക് പോകുക",
        "go_online": "ഓൺലൈനിൽ വരിക",
        "quick_stats": "ദ്രുത സ്ഥിതിവിവരക്കണക്കുകൾ",
        "total_earnings": "മൊത്തം വരുമാനം",
        "pending_jobs": "തീർപ്പുകൽപ്പിക്കാത്ത ജോലികൾ",
        "level_points": "ലെവൽ പോയിൻ്റുകൾ",
        "advanced_tools": "വിപുലമായ ഉപകരണങ്ങൾ",
        "find_accommodations": "താമസസ്ഥലങ്ങൾ കണ്ടെത്തുക",
        "career_progress": "കരിയർ പുരോഗതി",
        "incoming_requests": "വരുന്ന തൊഴിൽ അഭ്യർത്ഥനകൾ",
        "no_new_requests": "നിലവിൽ പുതിയ തൊഴിൽ അഭ്യർത്ഥനകളൊന്നുമില്ല.",
        "providers_near_you": "നിങ്ങളുടെ അടുത്തുള്ള തൊഴിൽ ദാതാക്കൾ",
        "provider_label": "ദാതാവ്:",
        "offered_wage": "വാഗ്ദാനം ചെയ്യുന്നത്:",
        "required_date": "ആവശ്യമാണ്:"
    }
}

dir_path = r"c:\Users\simaaq\.gemini\antigravity\scratch\labor-connect\client\src\i18n"

for lang, new_keys in keys_to_add.items():
    file_path = os.path.join(dir_path, f"{lang}.json")
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        data.update(new_keys)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
print("Translations updated successfully.")
