# 📋 Práctica 3: Persistencia de Datos y Control de Código

!!! example "Alcance"
    **Bloque:** UD6 · **Duración:** 2h · **RA/Criterios:** RA6 (a-d)

## Enunciado
Crear el esquema de base de datos de la aplicación con usuario de mínimo privilegio, conectar desde
PHP mediante PDO con consultas preparadas, y versionar el proyecto completo en Git con historial
semántico (Conventional Commits).

## Entregables
1. Script SQL de creación de BD/tabla/usuario con privilegios mínimos.
2. Código PDO con al menos una consulta preparada parametrizada.
3. Repositorio Git con `.gitignore` correcto y ≥ 5 commits siguiendo Conventional Commits.
4. Captura de intento de inyección SQL neutralizado por la consulta preparada.

## Rúbrica orientativa
| Criterio | Peso |
|---|---|
| Esquema y privilegios de BD correctos | 25% |
| Consultas preparadas (sin concatenación SQL) | 30% |
| Historial Git limpio y semántico | 25% |
| Prueba de resistencia a inyección SQL | 20% |
