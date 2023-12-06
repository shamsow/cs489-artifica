from PIL import Image
from transformers import BeitImageProcessor, BeitForImageClassification
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from imagehash import phash
from .models import Report

processor = BeitImageProcessor.from_pretrained('TimKond/diffusion-detection')
model = BeitForImageClassification.from_pretrained('TimKond/diffusion-detection')
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
}

@api_view(['POST'])
def check_image(request):
    try:
        image_url = request.data.get('url')
        image_response = requests.get(image_url, stream=True, headers=headers)
        if image_response.status_code != 200:
            return Response({"message": f"Request to {image_url} failed with status code: {image_response.status_code}"}, status=int(image_response.status_code))
        
        image = Image.open(image_response.raw).convert("RGB")

        inputs = processor(images=image, return_tensors="pt")
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class_idx = logits.argmax(-1).item()
        
        return Response({"label": model.config.id2label[predicted_class_idx]}, status=status.HTTP_200_OK)
    except Exception as e:
        print("error: ", e)
        return Response({"message": "Something went wrong :("}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def report(request):
    try:
        image_url = request.data.get('url')  # Assuming multiple URLs are sent as a list in the 'urls' field
        feedback = request.data.get('feedback')
        
        image = Image.open(requests.get(image_url, stream=True).raw)
        image_hash = str(phash(image))
        
        try:
            entry = Report.objects.get(image_hash=image_hash)
        except Report.DoesNotExist:
            entry = Report(image_hash=image_hash)

        # Update image URLs for the entry
        if image_url not in entry.image_urls:
            entry.image_urls.append(image_url)

        if feedback == 'negative':
            entry.real += 1
        elif feedback == 'positive':
            entry.synthetic += 1

        entry.save()

        return Response({
            "message": "Image feedback recorded successfully",
            "real": entry.real,
            "synthetic": entry.synthetic
            }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": "Something went wrong :("}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def batch_check_images(request):
    try:
        image_urls = request.data.get('urls')
        results = []

        for image_url in image_urls:
            image_response = requests.get(image_url, stream=True, headers=headers)
            if image_response.status_code == 200:
                image = Image.open(image_response.raw).convert("RGB")
                inputs = processor(images=image, return_tensors="pt")
                outputs = model(**inputs)
                logits = outputs.logits
                predicted_class_idx = logits.argmax(-1).item()
                results.append({ "url": image_url, "label": model.config.id2label[predicted_class_idx]})
            else:
                results.append({ "url": image_url, "error": f"Failed to fetch image with status code {image_response.status_code}"})

        return Response(results, status=status.HTTP_200_OK)
    except Exception as e:
        print("error: ", e)
        return Response({"message": "Something went wrong :("}, status=status.HTTP_400_BAD_REQUEST)
