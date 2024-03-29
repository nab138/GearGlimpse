# I shamelessly stole this from https://github.com/SideStore/SideStore/

SHELL := /bin/bash
.PHONY: help ios update tvos

HOMEBREW := $(shell command -v brew 2>/dev/null)

default: help

# Add the following 'help' target to your Makefile
# And add help text after each target name starting with '\#\#'
# A category can be added with @category

# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)

## ----- Helper functions ------

# Helper target for declaring an external executable as a recipe dependency.
# For example,
#   `my_target: | _program_awk`
# will fail before running the target named `my_target` if the command `awk` is
# not found on the system path.
_program_%: FORCE
	@_=$(or $(shell which $* 2> /dev/null),$(error `$*` command not found. Please install `$*` and try again))

# Helper target for declaring required environment variables.
#
# For example,
#   `my_target`: | _var_PARAMETER`
#
# will fail before running `my_target` if the variable `PARAMETER` is not declared.
_var_%: FORCE
	@_=$(or $($*),$(error `$*` is a required parameter))

_tag: | _var_VERSION
	make --no-print-directory -B README.md
	git commit -am "Tagging release $(VERSION)"
	git tag -a $(VERSION) $(if $(NOTES),-m '$(NOTES)',-m $(VERSION))
.PHONY: _tag

_push: | _var_VERSION
	git push origin $(VERSION)
	git push origin master
.PHONY: _push

## ------ Commmands -----------

TARGET_MAX_CHAR_NUM=20
## Show help
help:
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  ${YELLOW}%-$(TARGET_MAX_CHAR_NUM)s${RESET} ${GREEN}%s${RESET}\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' \
	$(MAKEFILE_LIST)

## Install dependencies.

install_node_dependencies:
	$(info Install node dependencies…)

	npm ci

install_ionic:
	$(info Install ionic…)

	npm install -g @ionic/cli
	
setup: \
	pre_setup \
	install_node_dependencies \
	install_ionic

# check_for_homebrew \
# update_homebrew \

pre_setup:
	$(info Project setup…)

check_for_homebrew:
	$(info Checking for Homebrew…)

ifeq ($(HOMEBREW),)
	$(error Homebrew is not installed)
endif

update_homebrew:
	$(info Updating Homebrew…)

	brew update

install_swift_lint:
	$(info Install swiftlint…)

	brew unlink swiftlint || true
	brew install swiftlint
	brew link --overwrite swiftlint

pull:
	$(info Pulling new commits…)

	git stash push || true
	git pull
	git stash pop || true

## -- Building --

build_proj:
	ionic capacitor add ios
	ionic capacitor sync
	ionic capacitor build ios

pod_install:
	cd ios/App/App && pod install

generate_assets:
	npx --yes @capacitor/assets generate --ios --iconBackgroundColor '#eeeeee' --iconBackgroundColorDark '#222222' --splashBackgroundColor '#eeeeee' --splashBackgroundColorDark '#111111'

build:
	@$(MAKE) build_proj
	@$(MAKE) pod_install
	@$(MAKE) generate_assets
	@xcodebuild -workspace ios/App/App.xcworkspace \
				-scheme App \
				-sdk iphoneos \
				archive -configuration release \
				-archivePath ./archive \
				CODE_SIGNING_REQUIRED=NO \
				AD_HOC_CODE_SIGNING_ALLOWED=YES \
				CODE_SIGNING_ALLOWED=NO \
				ORG_IDENTIFIER=me.nabdev \

ipa:
	mkdir Payload
	mkdir Payload/GearGlimpse.app
	cp -R archive.xcarchive/Products/Applications/App.app/ Payload/App.app/
	zip -r GearGlimpse.ipa Payload
