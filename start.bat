@echo off
echo === SamaCampus - Installation et démarrage ===
cd /d %~dp0
echo.
echo [1/2] Installation de @supabase/supabase-js...
npm install @supabase/supabase-js
echo.
echo [2/2] Démarrage du serveur de développement...
echo L'app sera accessible sur http://localhost:5173
npm run dev
pause
