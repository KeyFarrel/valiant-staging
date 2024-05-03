# production stage
FROM 10.14.158.185:5005/jenkins.repo/baseimage/nginx:1.22.1-alpine3.16.4

COPY docker/nginx/default.conf /temp/default.conf
RUN envsubst /app < /temp/default.conf > /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY /dist /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
