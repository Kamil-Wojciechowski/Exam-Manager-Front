@echo off
setlocal EnableDelayedExpansion

set prefix=exam-manager-front-

set react-app=%prefix%react-app

set "services_not_found=0"
set "services_processed=0"

CALL :check_and_start_container %react-app%

:check_and_start_container
echo Container is %~1
set "container_name=%~1"
set /a services_processed+=1
FOR /F "tokens=*" %%i IN ('docker ps -a -q --no-trunc --filter "name=!container_name!"') DO (
    SET "container_id=%%i"
    FOR /F "tokens=*" %%j IN ('docker ps -q --no-trunc --filter "id=%%i"') DO SET "running_container_id=%%j"
    IF "!running_container_id!"=="" (
        ECHO Starting !container_name!...
        docker start %%i
    ) ELSE (
        ECHO !container_name! is already running.
    )
    goto :container_checked
)
set /a services_not_found+=1

:container_checked
goto :passed

:passed
IF !services_processed! GTR 1 (
    IF !services_not_found! GTR 0 (
        ECHO One or more required containers do not exist. Starting all services with Docker Compose...
        docker-compose up -d
    ) ELSE (
        ECHO All required containers are up and running. No further action is taken.
    )
)

:end
endlocal
