FROM postgres:latest

ENV JAVA_VERSION=11

RUN apt-get update && \
    apt-get install -y wget apt-transport-https && \
    mkdir -p /etc/apt/keyrings && \
    wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | tee /etc/apt/keyrings/adoptium.asc && \
    echo "deb [signed-by=/etc/apt/keyrings/adoptium.asc] https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | tee /etc/apt/sources.list.d/adoptium.list && \
    apt-get update && apt-get install -y temurin-$JAVA_VERSION-jdk && \
    rm -rf /var/lib/apt/lists/*

COPY  apps/api/target/api-0.1.0-SNAPSHOT.jar /run/app/api.jar

RUN chown -R postgres:postgres /run/app && chmod -R 755 /run/app

RUN echo "cd /run/app && java -jar  -Dspring.profiles.active=docker api.jar &" > /docker-entrypoint-initdb.d/init.sh && \
    chmod 0755 /docker-entrypoint-initdb.d/init.sh

EXPOSE 8888

CMD ["postgres"]
