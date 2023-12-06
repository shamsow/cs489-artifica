from django.db import models

class Report(models.Model):
    image_urls = models.JSONField(default=list)  # JSONField to store multiple URLs as a list
    image_hash = models.CharField(max_length=64)  # Field for storing image hash
    real = models.IntegerField(default=0)
    synthetic = models.IntegerField(default=0)

    def __str__(self):
        return f"Image: {self.image_url}, Real: {self.real}, Synthetic: {self.synthetic}"
