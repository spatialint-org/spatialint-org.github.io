HUGO ?= hugo

.PHONY: dev build clean

dev:
	$(HUGO) server --buildDrafts --disableFastRender

build:
	rm -rf public resources
	$(HUGO) --minify --gc

clean:
	rm -rf public resources .hugo_build.lock
