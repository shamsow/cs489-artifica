from PIL import Image
from transformers import BeitImageProcessor, BeitForImageClassification
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Report

processor = BeitImageProcessor.from_pretrained('TimKond/diffusion-detection')
model = BeitForImageClassification.from_pretrained('TimKond/diffusion-detection')


@api_view(['POST'])
def check_image(request):
    try:
        image_url = request.data.get('url')
        image_response = requests.get(image_url, stream=True)
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
        image_url = request.data.get('url')
        feedback = request.data.get('feedback')
        
        try:
            entry = Report.objects.get(image_url=image_url)
        except Report.DoesNotExist:
            entry = Report(image_url=image_url, real=0, synthetic=0)

        if feedback == 'negative':
            entry.real += 1
        elif feedback == 'positive':
            entry.synthetic += 1

        entry.save()

        return Response({"message": "Image feedback recorded successfully"}, status=status.HTTP_200_OK)
    except:
        return Response({"message": "Something went wrong :("}, status=status.HTTP_400_BAD_REQUEST)
    
    