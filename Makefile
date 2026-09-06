DOCKER=docker
DOCKER_COMPOSE?=docker compose
RUN=$(DOCKER_COMPOSE) run --rm node

tty:
	$(RUN) /bin/bash
