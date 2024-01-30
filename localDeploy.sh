#!/bin/bash
prefix="exam-manager-front-"
react_app_service="react-app"

check_and_start_container() {
  local container_name=$1
  container_id=$(docker ps -a -q --no-trunc --filter "name=${prefix}${container_name}")

  if [ -n "$container_id" ]; then
    running=$(docker ps -q --no-trunc --filter "id=${container_id}")
    if [ -z "$running" ]; then
      echo "Starting $container_name..."
      docker start "$container_id"
    else
      echo "$container_name is already running."
    fi
  else
    echo "$container_name container does not exist."
  fi
}

container_exists=$(docker ps -a --format '{{.Names}}' | grep -w "$react_app_service")

if [ -n "$container_exists" ]; then
  check_and_start_container "$react_app_service"
else
  echo "React app container ($react_app_service) does not exist. Building and starting all services..."
  docker-compose up --build -d
fi
