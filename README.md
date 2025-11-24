# 🌱 EcoPoints

Plataforma web para la gestión y gamificación de acciones ecológicas.

## 📋 Descripción

EcoPoints es una aplicación web que permite a los usuarios registrar sus acciones ecológicas, calcular el CO₂ evitado, y recibir recompensas mediante un sistema de puntos, niveles y logros.

## 🛠️ Stack Tecnológico

### Backend

- Django 5.2.8
- Django REST Framework
- PostgreSQL (producción) / SQLite (desarrollo)
- JWT Authentication
- Python 3.11+

### Frontend (próximamente)

- React
- PWA (Progressive Web App)

## 🚀 Instalación Local

### Backend

1. Navegar al directorio backend:

```bash
cd backend
```

2. Crear y activar entorno virtual:

```bash
python -m venv venv
venv\Scripts\activate
```

3. Instalar dependencias:

```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno:

- Copiar `.env.example` a `.env`
- Configurar las variables necesarias

5. Ejecutar migraciones:

```bash
python manage.py migrate
```

6. Crear superusuario:

```bash
python manage.py createsuperuser
```

7. Iniciar servidor:

```bash
python manage.py runserver
```

El servidor estará disponible en: http://127.0.0.1:8000/

## 📚 Endpoints de API

- **Admin:** http://127.0.0.1:8000/admin/
- **API Root:** http://127.0.0.1:8000/api/

### Principales endpoints:

**Usuarios:**

- `POST /api/usuarios/registro/` - Registrar usuario
- `POST /api/usuarios/login/` - Iniciar sesión
- `GET /api/usuarios/perfil/` - Ver perfil propio
- `PUT /api/usuarios/perfil/editar/` - Editar perfil
- `GET /api/usuarios/ranking/` - Ranking global

**Tareas Ecológicas:**

- `GET /api/tipos-tarea/` - Listar tipos de tareas
- `POST /api/tareas/` - Registrar tarea ecológica
- `GET /api/tareas/` - Listar mis tareas
- `GET /api/tareas/estadisticas/` - Estadísticas personales

**Gamificación:**

- `GET /api/logros/` - Listar logros disponibles
- `GET /api/logros/mis-logros/` - Mis logros obtenidos
- `GET /api/grupos/` - Listar grupos ecológicos

## 📄 Licencia

Proyecto académico - INACAP 2025

---

Desarrollado con 💚 para un planeta más verde