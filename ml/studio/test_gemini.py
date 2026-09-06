from services.gemini_service import gemini_studio_service


prompt = """
Create a fashion editorial concept for a modern women's
summer dress.

Design direction:
- elegant contemporary silhouette
- lightweight fabric
- sophisticated floral pattern
- muted sage green and ivory palette
- premium fashion editorial photography
- clean studio background
- full garment visible
- realistic fabric texture
"""


print("Generating Studio concept...")

image_bytes = gemini_studio_service.generate_image(
    prompt
)

output_path = "studio_test_output.png"

with open(output_path, "wb") as file:
    file.write(image_bytes)

print(f"Studio image generated: {output_path}")