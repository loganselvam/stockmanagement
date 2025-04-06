from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer
from django.http import HttpResponse,JsonResponse
import csv
import io


class RegisterView(APIView):
    def post(self, request):
        data = request.data
        if User.objects.filter(username=data.get("username")).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            first_name=data.get("name"),
            username=data.get("username"),
            email=data.get("email"),
            password=data.get("password")
        )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"message": "User registered", "token": token.key})

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class ProductCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StockView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.all()
        print("products")
        for i in products:
            print(i.id,i.name,i.category,i.price,i.sold,i.description)
        total_revenue = sum([p.revenue() for p in products])
        # print(total_revenue)
        serializer = ProductSerializer(products, many=True)
        return Response({
            'products': serializer.data,
            'total_revenue': total_revenue
        })
    
    def put(self, request, pk=None):
        try:
            product_id = pk or request.data.get("id")
            product = Product.objects.get(id=product_id)
            serializer = ProductSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Product updated successfully", "product": serializer.data})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            product_id = pk or request.data.get("id")
            product = Product.objects.get(id=product_id)
            product.delete()
            return Response({"message": "Product deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

# CSV Export/import

class ExportCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="products.csv"'

        writer = csv.writer(response)
        writer.writerow(['Username', 'Name', 'Description', 'Quantity', 'Price', 'Category', 'Sold'])

        products = Product.objects.all()
        for product in products:
            writer.writerow([
                product.user.username if product.user else '',  # Optional user
                product.name,
                product.description,
                product.quantity,
                product.price,
                product.category,
                product.sold
            ])

        return response
    



class ImportCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get("file")

        if not file or not file.name.endswith('.csv'):
            return JsonResponse({"error": "Please upload a valid CSV file."}, status=400)

        decoded_file = file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)

        imported_count = 0
        updated_count = 0

        for row in reader:
            name = row['name']
            category = row['category']

            # Check if product exists with same name and category
            product, created = Product.objects.get_or_create(
                name=name,
                category=category,
                defaults={
                    "description": row.get("description", ""),
                    "quantity": int(row.get("quantity", 0)),
                    "price": float(row.get("price", 0)),
                    "sold": int(row.get("sold", 0)),
                    "user": request.user
                }
            )

            if not created:
                # If already exists, update the values (combine logic)
                product.quantity += int(row.get("quantity", 0))
                product.sold += int(row.get("sold", 0))
                product.description = row.get("description", product.description)
                product.price = float(row.get("price", product.price))
                product.save()
                updated_count += 1
            else:
                imported_count += 1

        return JsonResponse({
            "message": f"Import completed. {imported_count} new and {updated_count} updated."
        })