from django.shortcuts import render

from django.views.generic import View

# Create your views here.

class RootView(View):
    def get(self, context, path = None):
        return render(context, 'client/index.html')
    # end
# end
