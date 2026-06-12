import json
import os

keys_to_add = {
    "en": {
        "find_workers": "Find Workers",
        "discover_skilled_labor": "Discover skilled labor near your location",
        "category": "Category",
        "all_categories": "All Categories",
        "max_distance": "Max Distance (km)",
        "search": "Search",
        "check_weather": "Check Weather",
        "no_workers_found": "No workers found in your area. Try increasing the search distance or changing the category."
    },
    "hi": {
        "find_workers": "श्रमिक खोजें",
        "discover_skilled_labor": "अपने स्थान के पास कुशल श्रमिक खोजें",
        "category": "श्रेणी",
        "all_categories": "सभी श्रेणियां",
        "max_distance": "अधिकतम दूरी (किमी)",
        "search": "खोजें",
        "check_weather": "मौसम की जांच करें",
        "no_workers_found": "आपके क्षेत्र में कोई श्रमिक नहीं मिला। खोज दूरी बढ़ाने या श्रेणी बदलने का प्रयास करें।"
    },
    "kn": {
        "find_workers": "ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಿ",
        "discover_skilled_labor": "ನಿಮ್ಮ ಸ್ಥಳದ ಸಮೀಪವಿರುವ ನುರಿತ ಕಾರ್ಮಿಕರನ್ನು ಅನ್ವೇಷಿಸಿ",
        "category": "ವರ್ಗ",
        "all_categories": "ಎಲ್ಲಾ ವರ್ಗಗಳು",
        "max_distance": "ಗರಿಷ್ಠ ದೂರ (ಕಿ.ಮೀ)",
        "search": "ಹುಡುಕಿ",
        "check_weather": "ಹವಾಮಾನ ಪರಿಶೀಲಿಸಿ",
        "no_workers_found": "ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಯಾವುದೇ ಕಾರ್ಮಿಕರು ಕಂಡುಬಂದಿಲ್ಲ. ಹುಡುಕಾಟ ದೂರವನ್ನು ಹೆಚ್ಚಿಸಲು ಅಥವಾ ವರ್ಗವನ್ನು ಬದಲಾಯಿಸಲು ಪ್ರಯತ್ನಿಸಿ."
    },
    "ta": {
        "find_workers": "தொழிலாளர்களைத் தேடுங்கள்",
        "discover_skilled_labor": "உங்கள் இருப்பிடத்திற்கு அருகில் உள்ள திறமையான தொழிலாளர்களைக் கண்டறியவும்",
        "category": "வகை",
        "all_categories": "அனைத்து பிரிவுகள்",
        "max_distance": "அதிகபட்ச தூரம் (கிமீ)",
        "search": "தேடு",
        "check_weather": "வானிலை சரிபார்க்கவும்",
        "no_workers_found": "உங்கள் பகுதியில் தொழிலாளர்கள் யாரும் இல்லை. தேடல் தூரத்தை அதிகரிக்க அல்லது வகையை மாற்ற முயற்சிக்கவும்."
    },
    "te": {
        "find_workers": "కార్మికులను కనుగొనండి",
        "discover_skilled_labor": "మీ స్థానానికి సమీపంలో ఉన్న నైపుణ్యం కలిగిన కార్మికులను కనుగొనండి",
        "category": "వర్గం",
        "all_categories": "అన్ని వర్గాలు",
        "max_distance": "గరిష్ట దూరం (కిమీ)",
        "search": "శోధించండి",
        "check_weather": "వాతావరణాన్ని తనిఖీ చేయండి",
        "no_workers_found": "మీ ప్రాంతంలో కార్మికులు ఎవరూ కనుగొనబడలేదు. శోధన దూరాన్ని పెంచడానికి లేదా వర్గాన్ని మార్చడానికి ప్రయత్నించండి."
    },
    "ml": {
        "find_workers": "തൊഴിലാളികളെ കണ്ടെത്തുക",
        "discover_skilled_labor": "നിങ്ങളുടെ സ്ഥലത്തിന് സമീപമുള്ള വിദഗ്ദ്ധരായ തൊഴിലാളികളെ കണ്ടെത്തുക",
        "category": "വിഭാഗം",
        "all_categories": "എല്ലാ വിഭാഗങ്ങളും",
        "max_distance": "പരമാവധി ദൂരം (കി.മീ)",
        "search": "തിരയുക",
        "check_weather": "കാലാവസ്ഥ പരിശോധിക്കുക",
        "no_workers_found": "നിങ്ങളുടെ പ്രദേശത്ത് തൊഴിലാളികളെയൊന്നും കണ്ടെത്തിയില്ല. തിരയൽ ദൂരം വർദ്ധിപ്പിക്കാനോ വിഭാഗം മാറ്റാനോ ശ്രമിക്കുക."
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
