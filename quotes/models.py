# quotes/models.py

from django.db import models

SERVICES_CHOICES = [
    ('portfolio', 'Portfolio Websites'),
    ('corporate', 'Corporate Websites'),
    ('ecommerce', 'E-commerce Solutions'),
]


class QuotationRequest(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    services_needed = models.CharField(max_length=255, choices=SERVICES_CHOICES)
    project_description = models.TextField()
    budget = models.CharField(max_length=100, blank=True, null=True)
    timeline = models.CharField(max_length=100, blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Quotation Request from {self.name}"
