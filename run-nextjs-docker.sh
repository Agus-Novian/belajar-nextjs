#!/bin/bash

IMAGE_NAME="nextjs-docker"
CONTAINER_NAME="my-nextjs-container"

echo "Menghapus kontainer Docker sebelumnya (jika ada)..."
docker rm -f $CONTAINER_NAME

echo "Menghapus gambar Docker sebelumnya (jika ada)..."
docker rmi -f $IMAGE_NAME

echo "Membangun kontainer Docker..."
docker build -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo "Gagal membangun kontainer Docker."
    exit 1
fi

echo "Menjalankan kontainer Docker..."
docker run -d -p 3000:3000 --name $CONTAINER_NAME $IMAGE_NAME

if [ $? -ne 0 ]; then
    echo "Gagal menjalankan kontainer Docker."
    exit 1
fi

echo "Kontainer Docker berjalan di port 3000."
read -p "Press [Enter] to continue..."
