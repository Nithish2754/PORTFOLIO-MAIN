import google.generativeai as genai
from config import settings

print('GEMINI_KEY_PRESENT=', bool(settings.GEMINI_API_KEY))
for model_name in ["gemini-2.5-flash", "gemini-1.5-flash-8b"]:
    try:
        print('\nTesting model:', model_name)
        genai.configure(api_key=settings.GEMINI_API_KEY)
        m = genai.GenerativeModel(model_name)
        r = m.generate_content('Say one short sentence describing a simple project.')
        try:
            # If coroutine-like
            if hasattr(r, '__await__'):
                import asyncio
                r = asyncio.get_event_loop().run_until_complete(r)
        except Exception:
            pass
        print('RAW:', getattr(r, 'text', getattr(r, 'output_text', str(r)))[:1000])
    except Exception as e:
        print('ERROR for', model_name, e)
        import traceback
        traceback.print_exc()
