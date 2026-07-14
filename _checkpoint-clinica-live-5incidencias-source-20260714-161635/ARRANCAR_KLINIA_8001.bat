@echo off
cd /d "C:\Users\Usuario\OneDrive\Documentos\New project\te-explico-un-proyecto-que-quiero\te-explico-un-proyecto-que-quiero\app"
echo.
echo Klinia local: http://localhost:8001
echo Para otros dispositivos en la misma WiFi, usa http://TU-IP-LOCAL:8001
echo Busca tu IP en la linea IPv4 que aparece abajo:
ipconfig | findstr /i "IPv4"
echo.
where node >nul 2>nul
if %ERRORLEVEL%==0 (
  node server.js
) else (
  py -3.14 -m http.server 8001 --bind 0.0.0.0
)
pause

