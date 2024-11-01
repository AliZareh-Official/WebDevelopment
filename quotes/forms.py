# quotes/forms.py

from django import forms
from .models import QuotationRequest

class QuotationRequestForm(forms.ModelForm):
    class Meta:
        model = QuotationRequest
        fields = [
            'name',
            'email',
            'phone',
            'company_name',
            'services_needed',
            'project_description',
            'budget',
            'timeline',
        ]
        widgets = {
            'project_description': forms.Textarea(attrs={'rows': 5}),
        }
        labels = {
            'name': 'Full Name',
            'email': 'Email Address',
            'phone': 'Phone Number',
            'company_name': 'Company Name',
            'services_needed': 'Services Needed',
            'project_description': 'Project Description',
            'budget': 'Estimated Budget',
            'timeline': 'Expected Timeline',
        }
        help_texts = {
            'budget': 'Please specify your budget in USD.',
            'timeline': 'e.g., 2 weeks, 1 month, etc.',
        }
