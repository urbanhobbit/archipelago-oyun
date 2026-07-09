@echo off
cd /d "D:\Co3 Game\Oyun"

echo.
echo Degisiklikler:
git status --short

echo.
set /p MSG="Commit mesaji (bos birakırsan otomatik olur): "

if "%MSG%"=="" (
  for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set TARIH=%%c-%%b-%%a
  for /f "tokens=1-2 delims=: " %%a in ("%time%") do set SAAT=%%a:%%b
  set MSG=guncelleme %TARIH% %SAAT%
)

git add -A
git commit -m "%MSG%"
git push

echo.
echo Vercel deploy baslatildi:
echo https://archipelago-react.vercel.app
echo.
pause
