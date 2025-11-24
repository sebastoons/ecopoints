# backend/usuarios/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    """
    Configuración del modelo Usuario en el admin.
    """
    list_display = ['username', 'email', 'rol', 'puntos_totales', 'nivel', 'activo']
    list_filter = ['rol', 'activo', 'fecha_creacion']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Información Adicional', {
            'fields': ('rol', 'fecha_nacimiento', 'telefono', 'avatar')
        }),
        ('Gamificación', {
            'fields': ('puntos_totales', 'nivel', 'co2_total_evitado')
        }),
    )