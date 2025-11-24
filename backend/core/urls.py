# backend/core/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from usuarios.views import UsuarioViewSet
from tareas.views import TipoTareaViewSet, TareaRegistradaViewSet
from gamificacion.views import LogroViewSet, GrupoViewSet

# Crear router para registrar ViewSets
router = DefaultRouter()

# Registrar ViewSets
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'tipos-tarea', TipoTareaViewSet, basename='tipotarea')
router.register(r'tareas', TareaRegistradaViewSet, basename='tarea')
router.register(r'logros', LogroViewSet, basename='logro')
router.register(r'grupos', GrupoViewSet, basename='grupo')

urlpatterns = [
    path('', include(router.urls)),
]