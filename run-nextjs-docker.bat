@echo off

set IMAGE_NAME=nextjs-docker
set CONTAINER_NAME=my-nextjs-container

echo Menghapus kontainer Docker sebelumnya (jika ada)...
docker rm -f %CONTAINER_NAME%

echo Menghapus gambar Docker sebelumnya (jika ada)...
docker rmi -f %IMAGE_NAME%

echo Membangun kontainer Docker...
docker build -t %IMAGE_NAME% .

if %errorlevel% neq 0 (
    echo Gagal membangun kontainer Docker.
    exit /b %errorlevel%
)

echo Menjalankan kontainer Docker...
docker run -d -p 3000:3000 --name %CONTAINER_NAME% %IMAGE_NAME%

if %errorlevel% neq 0 (
    echo Gagal menjalankan kontainer Docker.
    exit /b %errorlevel%
)

echo Kontainer Docker berjalan di port 3000.
pause
