#!/bin/bash
docker build -t moex-client .
docker run -d --name moex-client -p 8080:8080 -v "$(pwd):/usr/share/nginx/html" moex-client