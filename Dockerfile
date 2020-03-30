FROM microsoft/mssql-server-linux

EXPOSE 1433

COPY ./ /simulator
WORKDIR /simulator
ENV SA_PASSWORD "Rooty-Tooty"
ENV ACCEPT_EULA "Y"

RUN /opt/mssql/bin/sqlservr & sleep 20 \
    && /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d master \
    -Q "create database uhtlive" \
    && /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d master \
    -e -i ./api/test/sql/UHT/test_schema.sql

CMD /opt/mssql/bin/sqlservr


