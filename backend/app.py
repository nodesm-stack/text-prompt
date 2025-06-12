import streamlit as st
from backend.config import API_KEY, MODEL_URL
from backend.general.prompt_templates import enhance_prompt
from backend.general.gemini import generate_gemini_content

st.title("Gemini Prompt Generator UI")

mode = st.radio("Choose Mode:", ["General Purpose", "Codebase"], horizontal=True)

prompt = st.text_area("Enter your prompt:")
enhance = st.checkbox("Enhance prompt before sending", value=True)

if st.button("Generate"): 
    if mode == "General Purpose":
        if enhance:
            prompt_to_send = enhance_prompt(prompt)
        else:
            prompt_to_send = prompt
        with st.spinner("Contacting Gemini API..."):
            result = generate_gemini_content(prompt_to_send, API_KEY, MODEL_URL)
            try:
                llm_text = result['candidates'][0]['content']['parts'][0]['text'].strip()
                # Try to extract an example if present (simple heuristic)
                example = None
                if "Example:" in llm_text:
                    parts = llm_text.split("Example:", 1)
                    enhanced = parts[0].strip()
                    example = parts[1].strip()
                else:
                    enhanced = llm_text
                # --- Improved Display ---
                st.markdown("""
                    <style>
                    .enhanced-section {background: #23272f; border-radius: 8px; padding: 1.5em; margin-bottom: 1em;}
                    .example-section {background: #1a1d23; border-radius: 8px; padding: 1em; margin-bottom: 1em;}
                    .tips-section {background: #23272f; border-radius: 8px; padding: 1em;}
                    .copy-btn {margin-bottom: 1em;}
                    </style>
                """, unsafe_allow_html=True)
                st.markdown("<div class='enhanced-section'><b>Enhanced Prompt (Ready to Copy):</b></div>", unsafe_allow_html=True)
                st.text_area("", enhanced, height=120, key="enhanced_prompt", help="Click the copy icon to copy.")
                if example:
                    st.markdown("<div class='example-section'><b>Example Output:</b></div>", unsafe_allow_html=True)
                    st.code(example, language=None)
                st.markdown("<div class='tips-section'><b>Tips:</b><ul><li>The enhanced prompt is concise and ready for LLMs.</li><li>Use the copy button on the text area.</li><li>If you want more examples, try making your original prompt more specific.</li><li>Use the 'Enhance' toggle to compare raw vs. enhanced prompts.</li></ul></div>", unsafe_allow_html=True)
            except (KeyError, IndexError, TypeError):
                st.error("Error: Unexpected response format.")
    else:
        st.info("Codebase mode is yet to work. Will do later.")
