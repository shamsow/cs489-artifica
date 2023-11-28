from django.db import models

class Report(models.Model):
    image_url = models.URLField(max_length=500)  # URLField for storing image URLs
    real = models.IntegerField()  # Field for storing real integers
    synthetic = models.IntegerField()  # Field for storing synthetic integers

    def __str__(self):
        return f"Image: {self.image_url}, Real: {self.real}, Synthetic: {self.synthetic}"
