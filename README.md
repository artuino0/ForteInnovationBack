```markdown
# Guía Técnica del Proyecto

## 1. Estructura del Proyecto

### Frontend

La estructura del frontend utiliza **Vue 3** y **Vite**, con **Pinia** como gestor de estado y **Tailwind CSS** para los estilos. Su organización asegura modularidad y facilidad de mantenimiento.
```

📂 src/
├── 📂 assets/ # Recursos estáticos (imágenes, íconos)
├── 📂 components/ # Componentes reutilizables
├── 📂 layouts/ # Diseños base
├── 📂 pages/ # Páginas principales (dashboard, clientes, transacciones)
├── 📂 router/ # Configuración de rutas
├── 📂 stores/ # Estado global (Pinia)
├── 📂 utils/ # Funciones y utilidades
├── App.vue # Componente principal
├── main.ts # Punto de entrada

```

### Backend
El backend utiliza **Node.js**, **Express** y **Mongoose** para integrarse con **MongoDB**. Su estructura es la siguiente:

```

📂 src/
├── 📂 config/ # Configuración (base de datos, variables de entorno)
├── 📂 controllers/ # Lógica de negocio (transacciones, clientes)
├── 📂 models/ # Modelos de datos con Mongoose
├── 📂 routes/ # Rutas de la API
├── 📂 utils/ # Utilidades (AWS S3, validaciones, etc.)
├── app.ts # Configuración principal
├── server.ts # Punto de entrada

````

---

## 2. Flujo de Datos

### Solicitudes desde el Frontend
- **Axios** realiza solicitudes al backend.
- **Pinia** gestiona el estado global y actualiza los componentes reactivos.

### Procesamiento en el Backend
- Las rutas del backend validan y procesan las solicitudes.
- Los datos se almacenan en MongoDB usando **Mongoose**.

### Presentación de Datos
- Tablas y gráficos interactivos en el frontend muestran los datos, utilizando bibliotecas como **Chart.js**.

---

## 3. Configuración e Integración del Backend

### Configuración Inicial
1. Configura las variables de entorno en un archivo `.env`:
   ```env
   PORT=4000
   MONGO_URI=<tu-uri-de-mongodb>
   AWS_ACCESS_KEY_ID=<tu-access-key>
   AWS_SECRET_ACCESS_KEY=<tu-secret-key>
````

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor:
   ```bash
   npm run dev
   ```

### Integración con el Frontend

- El backend proporciona endpoints REST que el frontend consume para manejar clientes, transacciones y reportes.

---

## 4. Instrucciones para Ejecutar la Aplicación Completa

### Backend

1. **Instalar dependencias**:
   ```bash
   npm install
   ```
2. **Configurar variables de entorno**:
   ```env
   PORT=4000
   MONGO_URI=<tu-uri-de-mongodb>
   AWS_ACCESS_KEY_ID=<tu-access-key>
   AWS_SECRET_ACCESS_KEY=<tu-secret-key>
   ```
3. **Iniciar el servidor**:
   ```bash
   npm run dev
   ```

### Frontend

1. **Instalar dependencias**:
   ```bash
   npm install
   ```
2. **Configurar variables de entorno**:
   ```env
   VITE_API=http://localhost:4000
   ```
3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

### Acceso

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:4000](http://localhost:4000)

---

## Notas Adicionales

- Verifica que **MongoDB** esté corriendo antes de iniciar el backend.
- Asegúrate de que las credenciales de AWS S3 sean válidas para la generación de reportes.
- Realiza pruebas exhaustivas para validar la integración completa.

```

```
