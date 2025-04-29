import requests
import json
import time
import os
import random

# Configuration Area
COMFYUI_API = "http://58.178.177.133:8188/" # remote address
# COMFYUI_API = "http://127.0.0.1:8188/"  # this is the local address for testing

json_file_path = "flux.1_img2img.json"
image_file_path = "output_ComfyUI_00188_.png"
upload_image_name = "input/output_ComfyUI_00188_.png"
new_prompt = "Lightly decorate the existing modern city balcony with some potted plants and small green vines. Place a few pots on the floor and the table, let a few light vines climb along the railings, but keep the white balcony railing, chairs, and urban skyline visible and unchanged. Subtle, realistic integration of plants without changing the original architecture or background. Photorealistic, minimalistic, clean style."

# Step 1: Load workflow
with open(json_file_path, "r", encoding="utf-8") as f:
    flow = json.load(f)

# Generate random seed
random_seed = random.randint(0, 2**32 - 1)
print(f"✅ Generated random seed: {random_seed}")

# Update seed in workflow
for node_id, node in flow.items():
    if "noise_seed" in node.get("inputs", {}):
        node["inputs"]["noise_seed"] = random_seed

# Step 2: Replace image path in LoadImage node
if "27" in flow:
    flow["27"]["inputs"]["image"] = os.path.basename(image_file_path)   # Remove forced input/ prefix
else:
    raise ValueError("❌ LoadImage node (27) not found!")


# Step 3: Replace Prompt text
found_prompt = False
for node_id, node in flow.items():
    if node.get("class_type", "").lower() == "cliptextencode":
        if "text" in node["inputs"]:
            node["inputs"]["text"] = new_prompt
            found_prompt = True
            break
if not found_prompt:
    raise ValueError("❌ CLIPTextEncode node not found, cannot modify prompt!")

# Step 4: Upload image to ComfyUI server
print("✅ Uploading image...")
with open(image_file_path, "rb") as f:
    files = {"image": (os.path.basename(image_file_path), f)}
    res_upload = requests.post(f"{COMFYUI_API}/upload/image", files=files)

if not res_upload.ok:
    print("❌ Image upload failed:", res_upload.status_code, res_upload.text)
    exit()
print("✅ Image uploaded successfully!")

time.sleep(3)

# Step 5: Submit task
payload = {
    "prompt": flow
}
print("✅ Submitting task...")
res = requests.post(f"{COMFYUI_API}/prompt", json=payload)

if not res.ok:
    print("❌ Submission failed:", res.status_code, res.text)
    exit()

res_json = res.json()
prompt_id = res_json["prompt_id"]
print(f"✅ Task submitted successfully! Prompt ID: {prompt_id}")

# Step 6: Wait for generation
print("⏳ Waiting for generation...")
max_retries = 60  # Wait up to 10 minutes
retry_interval = 10  # Check every 10 seconds

for i in range(max_retries):
    # Step 7: Query generation results
    history = requests.get(f"{COMFYUI_API}/history/{prompt_id}")
    if not history.ok:
        print("❌ History query failed:", history.status_code, history.text)
        exit()

    res_data = history.json()
    outputs = res_data.get(prompt_id, {}).get("outputs", {})
    
    if outputs:  # If there are output results
        # Step 8: Download output image
        downloaded = False
        for node_id, node_output in outputs.items():
            if "images" in node_output:
                for img in node_output["images"]:
                    filename = img["filename"]
                    subfolder = img.get("subfolder", "")
                    img_url = f"{COMFYUI_API}/view?filename={filename}&type=output&subfolder={subfolder}"
                    img_data = requests.get(img_url).content
                    output_name = f"output_{filename}"
                    with open(output_name, "wb") as f:
                        f.write(img_data)
                    print(f"✅ Image generation completed, saved as {output_name}")
                    downloaded = True
                    exit()  # Exit program after finding the image

        if not downloaded:
            print("⚠️ No output image found! Please check if the workflow has a SaveImage node.")
            exit()
    
    print(f"⏳ Waiting... ({i+1}/{max_retries})")
    time.sleep(retry_interval)

print("❌ Timeout waiting for generation results!")