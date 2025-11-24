# backend/gamificacion/admin.py

from django.contrib import admin
from .models import Logro, LogroUsuario, Grupo, MiembroGrupo

@admin.register(Logro)
class LogroAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'tipo', 'puntos_requeridos', 'tareas_requeridas', 'activo']
    list_filter = ['tipo', 'activo']

@admin.register(Grupo)
class GrupoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'creador', 'publico', 'activo', 'fecha_creacion']
    list_filter = ['publico', 'activo']
    search_fields = ['nombre', 'descripcion']