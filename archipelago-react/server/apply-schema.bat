@echo off
setlocal
cd /d "%~dp0"

if not exist ".env" (
  echo HATA: server\.env bulunamadi. Once .env.example dosyasini .env olarak kopyalayip
  echo Supabase baglanti bilgilerini gir ^(DATABASE_URL, DB_SSL=true^).
  exit /b 1
)

if not exist "node_modules" (
  echo Bagimliliklar kuruluyor...
  call npm install
  if errorlevel 1 (
    echo HATA: npm install basarisiz oldu.
    exit /b 1
  )
)

echo.
echo Supabase uzerinde schema.sql uygulaniyor...
node scripts\apply-schema.js
if errorlevel 1 (
  echo.
  echo HATA: schema uygulanamadi, yukaridaki mesaja bak.
  exit /b 1
)

echo.
echo Tamamlandi. Supabase Dashboard ^> Table Editor'dan tablolari kontrol edebilirsin.
endlocal
