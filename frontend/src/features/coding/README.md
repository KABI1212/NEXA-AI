# NEXA AI Directory Specification: `frontend/src/features/coding`

## 1. Purpose
Monaco code editor compiler workspace.

## 2. Expected Files
- `pages/CodingLab.tsx (Resizing panel setups)`
- `components/MonacoEditor.tsx (Monaco frame components)`

## 3. Responsibilities
Mount code editors and capture changes safely to prevent leaks.

## 4. Dependencies
- `monaco-editor`
- `@tanstack/react-query`
