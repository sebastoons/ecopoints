# backend/tareas/admin.py

from django.contrib import admin
from .models import TipoTarea, TareaRegistrada

@admin.register(TipoTarea)
class TipoTareaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'categoria', 'co2_evitado_por_accion', 'puntos_otorgados', 'activa']
    list_filter = ['categoria', 'activa']
    search_fields = ['nombre', 'descripcion']

@admin.register(TareaRegistrada)
class TareaRegistradaAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'tipo_tarea', 'fecha_realizacion', 'co2_evitado', 'puntos_ganados', 'validada']
    list_filter = ['validada', 'fecha_realizacion', 'tipo_tarea__categoria']
    search_fields = ['usuario__username', 'tipo_tarea__nombre']
    date_hierarchy = 'fecha_realizacion'