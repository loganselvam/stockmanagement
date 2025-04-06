from django.urls import path
from .views import RegisterView, LoginView,ProductCreateView,StockView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('products/', ProductCreateView.as_view(), name='product-create'),
    path('stock/', StockView.as_view(), name='stock-view'),
    path('delete/<int:pk>/', StockView.as_view(), name='stock-view'),
    path('update/<int:pk>/', StockView.as_view(), name='stock-update'),
]
