import requests
import json
import time
import os
import random
import argparse
import sys
import shutil

# 设置控制台编码
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# 解析命令行参数
parser = argparse.ArgumentParser(description='Generate balcony image using ComfyUI')
parser.add_argument('--prompt', type=str, required=True, help='The prompt for image generation')
parser.add_argument('--image', type=str, required=True, help='Path to the uploaded image')
parser.add_argument('--workflow', type=str, required=True, help='JSON string of the workflow configuration')
args = parser.parse_args()

# Configuration Area
# COMFYUI_API = "http://192.168.1.119:8188/" # local network address
# COMFYUI_API = "http://127.0.0.1:8188/"  # this is the local address for testing
COMFYUI_API = "http://58.178.177.133:8188/"  # This is the remote address.


# 使用传入的工作流配置
flow = json.loads(args.workflow)
image_file_path = args.image
upload_image_name = os.path.basename(image_file_path)
new_prompt = args.prompt

# Step 1: Upload image to ComfyUI server
print("[INFO] Uploading image...")
with open(image_file_path, "rb") as f:
    files = {"image": (upload_image_name, f)}
    res_upload = requests.post(f"{COMFYUI_API}/upload/image", files=files)

if not res_upload.ok:
    print("[ERROR] Image upload failed:", res_upload.status_code, res_upload.text)
    sys.exit(1)
print("[INFO] Image uploaded successfully!")

time.sleep(3)

# Step 2: Submit task
payload = {
    "prompt": flow
}
print("[INFO] Submitting task...")
res = requests.post(f"{COMFYUI_API}/prompt", json=payload)

if not res.ok:
    print("[ERROR] Submission failed:", res.status_code, res.text)
    sys.exit(1)

res_json = res.json()
prompt_id = res_json["prompt_id"]
print(f"[INFO] Task submitted successfully! Prompt ID: {prompt_id}")

# Step 3: Wait for generation
print("[INFO] Waiting for generation...")
max_retries = 60  # Wait up to 10 minutes
retry_interval = 10  # Check every 10 seconds

for i in range(max_retries):
    # Step 4: Query generation results
    history = requests.get(f"{COMFYUI_API}/history/{prompt_id}")
    if not history.ok:
        print("[ERROR] History query failed:", history.status_code, history.text)
        sys.exit(1)

    res_data = history.json()
    outputs = res_data.get(prompt_id, {}).get("outputs", {})
    
    if outputs:  # If there are output results
        # Step 5: Download output image
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
                    print(f"[INFO] Image generation completed, saved as {output_name}")
                    sys.exit(0)  # Exit program after finding the image

        print("[WARNING] No output image found! Please check if the workflow has a SaveImage node.")
        sys.exit(1)
    
    print(f"[INFO] Waiting... ({i+1}/{max_retries})")
    time.sleep(retry_interval)

print("[ERROR] Timeout waiting for generation results!")
sys.exit(1)