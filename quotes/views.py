# quotes/views.py

from django.shortcuts import render, redirect
from .forms import QuotationRequestForm

def home(request):
    if request.method == 'POST':
        form = QuotationRequestForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('thank_you')
    else:
        form = QuotationRequestForm()
    return render(request, 'index.html', {'form': form})

def thank_you(request):
    return render(request, 'thank_you.html')
