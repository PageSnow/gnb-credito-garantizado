# GNB Sudameris · Portal de Crédito Garantizado Digital

> Mockup funcional del portal de otorgamiento de créditos garantizados con Fondos de Pensión Voluntaria y CDT — GNB Sudameris Colombia S.A.

🔗 **Demo:** [Ver en GitHub Pages](https://tu-usuario.github.io/gnb-credito-garantizado/)

---

## 📋 Descripción del producto

El **Crédito Garantizado con Fondos de Pensión Voluntaria y CDT** es un producto financiero que permite a los clientes de GNB Sudameris acceder a liquidez inmediata sin necesidad de liquidar sus inversiones de largo plazo.

| Característica | Detalle |
|---|---|
| **Esquema de pago** | Bullet — capital + intereses al vencimiento |
| **Plazo** | 12 meses, prorrogable hasta el año 10 |
| **Tasa** | IBR 3M + puntos básicos (opción cartelera disponible) |
| **Garantías** | FPV portafolio moderado/bajo · CDT cualquier plazo |
| **Cobertura requerida** | 120% – 130% según tipo de fondo |
| **Desembolso** | ACH mismo día hábil |
| **Proceso** | 100% digital · < 2 horas · sin desplazamiento |

---

## 📁 Estructura del repositorio

```
gnb-credito-garantizado/
│
├── index.html          # Portal cliente — 6 pasos del proceso
├── arquitectura.html   # Arquitectura técnica (para TI/Arquitectura)
├── snowflake.html      # Dashboard Snowflake (para área de datos)
├── acuerdo.html        # Acuerdo tripartito (para Jurídico/Riesgo)
│
├── styles.css          # Estilos globales (design system GNB)
├── app.js              # Lógica de interacción y navegación
│
└── README.md           # Este archivo
```

---

## 🗂️ Páginas y audiencias

### 1. `index.html` — Portal del cliente
**Audiencia:** Cliente final / área de producto

Flujo completo de solicitud en 6 pasos:
1. **Selección de garantía** — saldos en tiempo real desde fiduciarias
2. **Autorización de datos** — acuerdo tripartito + firma OTP
3. **Verificación de identidad** — biometría, RNEC, centrales de riesgo
4. **Gestión documental** — carga de docs + registro Confecámaras
5. **Simulador** — tasa IBR dinámica, plazo bullet, análisis de cobertura
6. **Desembolso** — tracking del proceso + giro ACH

### 2. `arquitectura.html` — Arquitectura técnica
**Audiencia:** Área de Tecnología y Arquitectura del banco

5 capas del sistema:
- Canal cliente (React SPA / PWA / Onboarding Digital)
- API Gateway y orquestador (Kong / Kafka)
- Sistemas core y externos (CORE bancario, fiduciarias, Confecámaras, ACH)
- Seguridad e identidad (biometría, firma electrónica, anti-fraude)
- Datos y analítica (Snowflake / dbt / dashboards)

### 3. `snowflake.html` — Dashboard Snowflake
**Audiencia:** Área de Datos

- KPIs del portfolio de créditos garantizados
- Tabla de garantías activas con cobertura en tiempo real
- Alertas de monitoreo (cobertura < 115%, < 110%, < 100%)
- IBR histórico y tasa vigente
- Modelo de datos: tablas DIM y FACT principales
- Pipeline de ingesta (CDC + batch nocturno + alertas 07:00 AM)
- Consultas SQL Snowflake frecuentes

### 4. `acuerdo.html` — Acuerdo tripartito
**Audiencia:** Jurídico, Riesgo, Negociación con fiduciarias

- Partes del acuerdo y roles
- Flujo completo en 4 fases (expandible por fases)
- Cláusulas críticas:
  - Fuente líquida de pago (ejecución en 2 horas hábiles)
  - Entrega de información online (API + SLA 3s)
  - Registro garantías a 5 años en Confecámaras
  - Política de riesgo moderado

---

## 🚀 Despliegue en GitHub Pages

### Pasos para publicar:

1. **Fork o clona** este repositorio en tu cuenta de GitHub

2. Ve a **Settings → Pages** en tu repositorio

3. En **Source** selecciona:
   - Branch: `main`
   - Folder: `/ (root)`

4. Haz clic en **Save**

5. En 1–2 minutos tu página estará disponible en:
   ```
   https://TU-USUARIO.github.io/gnb-credito-garantizado/
   ```

### Alternativa — correr localmente:
```bash
# Clona el repo
git clone https://github.com/tu-usuario/gnb-credito-garantizado.git
cd gnb-credito-garantizado

# Sirve con cualquier servidor estático
npx serve .
# o simplemente abre index.html en tu navegador
```

---

## 🏗️ Arquitectura de integraciones

```
Cliente (browser)
      │
      ▼
API Gateway (Kong / AWS API GW)
      │
      ├──► CORE Bancario GNB (T24 / Cobis)
      ├──► API Fiduciarias (Skandia, Protección, Porvenir)
      │        REST / SOAP · saldos tiempo real · bloqueo
      ├──► Confecámaras SIGaR
      │        Registro garantías mobiliarias · Ley 1676
      ├──► ACH Colombia
      │        Desembolso ISO 20022 · mismo día
      ├──► Biometría + RNEC (Jumio / Truora)
      ├──► Centrales de riesgo (TransUnion / DataCrédito)
      └──► Snowflake
               DWH · monitoreo diario · alertas · SFC
```

---

## 📊 Modelo de datos Snowflake (tablas principales)

| Tabla | Tipo | Descripción |
|---|---|---|
| `DIM_CREDITO_GARANTIZADO` | Dimensión | Maestro de créditos: monto, tasa, plazo, estado |
| `FACT_SALDO_DIARIO_GARANTIA` | Hecho diario | Saldos fiduciarias + cobertura + flag_alerta |
| `FACT_EVENTOS_COBERTURA` | Hecho eventos | Alertas, ejecuciones, moras, prepagos |
| `DIM_FIDUCIARIA` | Dimensión | Datos de integración API por fiduciaria |
| `FACT_CONCILIACION_DIARIA` | Conciliación | Diferencias saldo fiduciaria vs banco |

**Pipeline:** Kafka Connect (CDC tiempo real) → dbt → Snowflake → Alerts 07:00 AM → Reporte SFC 07:15 AM

---

## ⚖️ Marco normativo

| Norma | Aplicación |
|---|---|
| Circular 007 SFC | Reporte cartera y garantías |
| Ley 1676 de 2013 | Garantías mobiliarias (Confecámaras) |
| Decreto 2364 de 2012 | Firma electrónica |
| Ley 1581 de 2012 | Datos personales |
| SARLAFT | Prevención LA/FT |
| ISO 27001 | Seguridad de la información |

---

## 🗓️ Roadmap de implementación

| Fase | Actividades | Plazo |
|---|---|---|
| **Fase 0** | Acuerdos con fiduciarias + validación normativa SFC | 2–3 meses |
| **Fase 1** | Desarrollo portal + microservicios + APIs fiduciarias (sandbox) | 3–4 meses |
| **Fase 2** | Integración CORE bancario + ACH + Confecámaras + Snowflake | 2–3 meses |
| **Fase 3** | QA + pentest + certificación SFC + piloto 50 clientes | 2 meses |
| **Fase 4** | Lanzamiento controlado → escala masiva | 2–3 meses |
| **Total MVP** | | **11–15 meses** |

---

## 💡 Recomendaciones clave

- **Desembolso:** Usar ACH como canal principal. BREV solo para clientes con historial GNB > 12 meses y montos < $30M en primera operación.
- **Confecámaras a 5 años:** Ahorro ~$320.000 COP por operación al evitar renovación anual en cada prórroga.
- **Umbral de alerta temprana al 115%:** Adicionar este umbral en `sp_alerta_cobertura()` para dar margen antes del crítico 110%.

---

## 📞 Contacto técnico

| Área | Responsable |
|---|---|
| Producto digital | Vicepresidencia Banca Personal |
| Arquitectura TI | Gerencia de Tecnología |
| Datos / Snowflake | Área de Datos e Inteligencia |
| Jurídico / acuerdos | Vicepresidencia Jurídica |
| Riesgo | Vicepresidencia de Riesgo |

---

*GNB Sudameris Colombia S.A. · Documento confidencial · Uso interno · Mayo 2025*
