import requests
import json
import time
import os
import random

# 配置区
COMFYUI_API = "http://127.0.0.1:8188"
json_file_path = "flux.1_img2img.json"
image_file_path = "563189990.jpg"
upload_image_name = "input/563189990.jpg"
new_prompt = "Lightly decorate the existing modern city balcony with some potted plants and small green vines. Place a few pots on the floor and the table, let a few light vines climb along the railings, but keep the white balcony railing, chairs, and urban skyline visible and unchanged. Subtle, realistic integration of plants without changing the original architecture or background. Photorealistic, minimalistic, clean style."

# Step 1: 加载workflow
with open(json_file_path, "r", encoding="utf-8") as f:
    flow = json.load(f)

# 生成随机seed
random_seed = random.randint(0, 2**32 - 1)
print(f"✅ 生成随机seed: {random_seed}")

# 更新workflow中的seed
for node_id, node in flow.items():
    if "noise_seed" in node.get("inputs", {}):
        node["inputs"]["noise_seed"] = random_seed

# Step 2: 替换 LoadImage 节点里的图片路径
if "27" in flow:
    flow["27"]["inputs"]["image"] = os.path.basename(image_file_path)   # 去掉强制加上input/
else:
    raise ValueError("❌ 找不到LoadImage节点（27）！")


# Step 3: 替换 Prompt 文本
found_prompt = False
for node_id, node in flow.items():
    if node.get("class_type", "").lower() == "cliptextencode":
        if "text" in node["inputs"]:
            node["inputs"]["text"] = new_prompt
            found_prompt = True
            break
if not found_prompt:
    raise ValueError("❌ 找不到CLIPTextEncode节点，无法修改Prompt！")

# Step 4: 上传图片到ComfyUI服务器
print("✅ 正在上传图片...")
with open(image_file_path, "rb") as f:
    files = {"image": (os.path.basename(image_file_path), f)}
    res_upload = requests.post(f"{COMFYUI_API}/upload/image", files=files)

if not res_upload.ok:
    print("❌ 图片上传失败:", res_upload.status_code, res_upload.text)
    exit()
print("✅ 图片上传成功！")

time.sleep(3)

# Step 5: 提交任务
payload = {
    "prompt": flow
}
print("✅ 正在提交任务...")
res = requests.post(f"{COMFYUI_API}/prompt", json=payload)

if not res.ok:
    print("❌ 提交失败:", res.status_code, res.text)
    exit()

res_json = res.json()
prompt_id = res_json["prompt_id"]
print(f"✅ 任务提交成功！Prompt ID: {prompt_id}")

# Step 6: 等待生成
print("⏳ 等待生成中...")
max_retries = 60  # 最多等待10分钟
retry_interval = 10  # 每10秒检查一次

for i in range(max_retries):
    # Step 7: 查询生成结果
    history = requests.get(f"{COMFYUI_API}/history/{prompt_id}")
    if not history.ok:
        print("❌ 查询历史失败:", history.status_code, history.text)
        exit()

    res_data = history.json()
    outputs = res_data.get(prompt_id, {}).get("outputs", {})
    
    if outputs:  # 如果已经有输出结果
        # Step 8: 下载输出图
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
                    print(f"✅ 图片生成完毕，保存为 {output_name}")
                    downloaded = True
                    exit()  # 找到图片后退出程序

        if not downloaded:
            print("⚠️ 没有找到输出图片！请检查workflow是否有SaveImage节点。")
            exit()
    
    print(f"⏳ 等待中... ({i+1}/{max_retries})")
    time.sleep(retry_interval)

print("❌ 等待超时，未能获取到生成结果！")