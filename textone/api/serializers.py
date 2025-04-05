from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    revenue = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'quantity','category', 'price', 'sold', 'revenue']

    def get_revenue(self, obj):
        return obj.revenue()