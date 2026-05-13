# Integrations Map

**Date**: 2026-05-13

## External APIs
- **Rafe Backend REST API**: The primary integration for this application is the existing Rafe backend system (`../rafe-backend`) which exposes a REST API. Communication is intended to be handled via `axios`.

## Authentication
- Expected to be integrated via the backend API (tokens/sessions), using `@tanstack/react-query` and `axios` for authenticated requests. The `src/features/auth` directory is prepared for this logic.

## Databases
- None directly in the frontend. All data persistence is handled via the Rafe backend API.

## Third-Party Services
- None detected currently.

## Webhooks
- None directly in the frontend SPA.
