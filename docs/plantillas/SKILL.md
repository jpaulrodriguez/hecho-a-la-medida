---
# ─────────────────────────────────────────────────────────────────────────────
# PLANTILLA DE SKILL · «Hecho a la medida» · Jonathan Rodríguez
# Cómo usarla: copia esta carpeta, cámbiale el nombre y reemplaza todo lo que
# está entre [CORCHETES]. Las líneas que empiezan con # son comentarios para ti:
# bórralas cuando termines. El ejemplo (un informe mensual de reseñas de una
# tienda ficticia) está para que veas cómo se llena cada parte.
# ─────────────────────────────────────────────────────────────────────────────

# NOMBRE: en minúsculas, sin tildes ni espacios (usa guiones).
name: informe-de-resenas

# DESCRIPCIÓN: la parte más importante. La IA la lee para decidir si usa la skill.
# No es un resumen: dice CUÁNDO usarla. Incluye las frases con las que alguien
# te pediría este trabajo, aunque no use tus palabras técnicas.
# Ejemplo de juguete:
description: Clasifica las reseñas de clientes de un mes y escribe el informe mensual con temas, sentimiento y urgencias. Úsala cuando pidan «el informe de reseñas», «qué dicen los clientes este mes», «de qué se quejan», «resumen de comentarios» o cuando suban una exportación de reseñas, aunque no digan la palabra informe. No la uses para responder reseñas una por una.
---

# [Nombre legible de la skill]
<!-- Ejemplo: Informe mensual de reseñas -->

## Para qué sirve
<!-- Dos o tres líneas: qué problema resuelve y para quién. -->
[Convierte las reseñas de un mes en un informe que dice de qué se quejan los clientes, qué elogian y qué hay que atender ya.]

## Para qué NO sirve
<!-- Decir lo que no hace evita que se active donde no toca. -->
- [No responde reseñas una por una.]
- [No compara con la competencia.]

## Antes de empezar
<!-- Las preguntas que harías tú antes de arrancar. Si falta algo que no es
     crítico, la IA avanza con supuestos marcados «a validar» en vez de frenarse. -->
Pide o confirma:
1. [El archivo de reseñas del mes (exportación con id, fecha, estrellas y texto).]
2. [El mes que cubre el informe.]
3. [Si hay algún tema que la tienda quiera vigilar en especial.]

Si falta el punto 3, sigue sin él y dilo en el informe.

## Paso a paso
<!-- Pasos numerados. Cada paso dice qué entra y qué sale. Si un paso dice
     «analiza», no es un paso, es un deseo: di qué mira y qué entrega. -->
1. **Limpiar.** Entra: el archivo de reseñas. Sale: el mismo archivo sin nombres, correos ni teléfonos.
2. **Clasificar.** Entra: cada reseña limpia. Sale: tema, sentimiento y frase clave, usando SOLO la lista de la sección «Listas cerradas».
3. **Contar.** Entra: las reseñas clasificadas. Sale: cuántas hay por tema, sentimiento y urgencia. (Los números se calculan, no se estiman.)
4. **Redactar.** Entra: solo los números del paso 3 y las frases clave. Sale: el informe con el formato de abajo.
5. **Revisar.** Antes de entregar, aplica la lista de la sección «Reglas».

## Listas cerradas
<!-- Si la IA tiene que escoger, que escoja de una lista. Cada valor con su
     definición y, si hay una frontera difícil, su ejemplo frontera. -->
| Tema | Incluye | No incluye |
|---|---|---|
| [producto] | [Sabor, molienda, frescura] | [Empaque roto: va en empaque] |
| [envio] | [Demora, pedido perdido, domiciliario] | [Trato por chat: va en atencion] |
| [atencion] | [Respuestas, tono, solución de reclamos] | [Pedido que no llega aunque nadie conteste: va en envio] |
| [no_mapeado] | [Lo que no encaja en ninguno] | — |

## Formato de entrega
<!-- La estructura exacta de lo que debe salir. Si sale distinto cada vez,
     nadie lo puede revisar rápido. -->
1. **Lo urgente** (máximo 3 viñetas, primero lo más grave).
2. **Tabla de temas** (tema, cantidad, % del total, una frase clave textual).
3. **Lo que elogian** (máximo 3 viñetas).
4. **Supuestos y vacíos** (lo que se asumió o faltó).

## Reglas
<!-- Lo que nunca puede pasar. Recuerda: lo que de verdad no se negocia funciona
     mejor como regla fija por fuera de las instrucciones (una fórmula, un filtro). -->
- [Ninguna cifra que no salga del conteo del paso 3.]
- [Toda cita es textual: copiada de la reseña, nunca reescrita.]
- [Nunca nombres, correos ni teléfonos de clientes en el informe.]
- [Nada de frases vacías como «en general los clientes están satisfechos».]

## Errores que ya vi
<!-- Lo que ya te salió mal una vez, para que no se repita. Es la sección que más
     crece con el tiempo. -->
- [Confundir envío con atención cuando la reseña menciona las dos cosas: decide por lo que el cliente quiere resolver.]

## Archivos de apoyo (opcional)
<!-- Si la skill necesita material largo, va en archivos aparte dentro de la
     carpeta, y aquí solo se dice cuándo leerlos. Así la skill principal queda corta.
     Estructura típica:
       informe-de-resenas/
         SKILL.md          ← este archivo
         references/       ← documentos de consulta (definiciones, ejemplos)
         scripts/          ← programas que la skill puede correr
-->
- [references/ejemplos-frontera.md: léelo cuando una reseña mezcle temas.]

<!-- ─────────────────────────────────────────────────────────────────────────
MANTENIMIENTO (bórralo de tu copia final si quieres)
· Edita siempre la versión fuente y copia desde ahí. Si editas la copia
  instalada, la pierdes en la próxima sincronización.
· Después de cambiarla, abre una conversación nueva: muchos asistentes cargan
  las skills al empezar.
· Cada trimestre revisa cifras, nombres de productos y reglas contra la fuente
  original. Las skills también se vencen.
· Antes de instalar una skill de otra persona, léela completa.
───────────────────────────────────────────────────────────────────────── -->
