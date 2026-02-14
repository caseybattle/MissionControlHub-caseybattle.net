
import re
import json
import os

input_file = r"C:\Users\casba\Antigravity Skills\youtube-factory\prompts_for_user.md"
output_file = r"C:\Users\casba\Antigravity Skills\mission-control\parsed_prompts.json"

with open(input_file, "r", encoding="utf-8") as f:
    content = f.read()

scenes = []
# Regex to find scenes: ## Scene X\n**Filename:** ...\n**Prompt:**\n> (content)
# The regex must capture the prompt text after the prompt block quote marker
pattern = re.compile(r"## Scene \d+\s+\*\*Filename:\*\*\s+`[^`]+`\s+\*\*(?:Prompt|Visual Prompts?):\*\*\s*\n>\s*(.+?)(?=\n\n##|\Z)", re.DOTALL)

for match in pattern.finditer(content):
    prompt_text = match.group(1).strip()
    scenes.append({
        "id": f"scene_{len(scenes) + 1:03d}",
        "script": "",
        "visualPrompt": prompt_text,
        "image": "",
        "video": "",
        "status": "draft"
    })

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(scenes, f, indent=2)

print(f"Parsed {len(scenes)} scenes to {output_file}")
