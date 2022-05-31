#!/bin/sh

# exit the script on command errors or unset variables
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
# shellcheck disable=SC2039
if set -o pipefail 2> /dev/null; then
  set -euo pipefail
fi
# define how strings with spaces or tabs are iterated
IFS="$(echo t | tr t \\t)"

# Formatting and color codes.
RED='\033[0;31m'
BLUE='\033[1;34m'
GREEN='\033[1;32m'
BOLD='\033[1m'
UNDERLINE='\033[4m'
RESET='\033[0m' # Reset color and formatting

# Define variables
SCRIPT_VERSION='1.0.0'
VERSION=latest
FORCE=false

if ! [ "${FRONTEND_INSTALL_DIRECTORY:-}" ]; then
  FRONTEND_INSTALL_DIRECTORY="$(pwd)/waiterrobot-web"
fi
INSTALL_TEMP_DIRECTORY="$(pwd)/waiterrobot-web-tmp"

printHelp() {
  printf "${BOLD}${UNDERLINE}WaiterRobot-Web installation help${RESET} (${GREEN}v${SCRIPT_VERSION})${RESET}\n"
  printf "Usage: ./frontend.sh -v [version] -f\n"
  printf "  -v ['dev', 'rc']    (optional) select a specific version to install\n"
  printf "  -f                  (optional) force install without asking questions\n"
  _success=true
  exit 0
}

while getopts "v:fsh" opt; do
  case "${opt}" in
  h)
    printHelp
    ;;
  f)
    printf "  ${BOLD}-f was triggered, force install without asking questions${RESET}\n"
    FORCE=true
    ;;
  v)
    printf "  ${BOLD}-v was triggered, with parameter $OPTARG ${RESET}\n"
    if [ "$OPTARG" = "rc" ]; then
      VERSION=rc
    elif [ "$OPTARG" = "dev" ]; then
      VERSION=testing
    else
      printHelp
    fi
    ;;
  \?)
    printHelp
    ;;
  :)
    printHelp
    ;;
  esac
done

# Print an error message and exit the program.
errorAndExit() {
  printf "\n${RED}ERROR:${RESET} %s\n" "$1"
  exit 1
}

# Set up an exit handler so we can print a help message on failures.
_success=false
shutdown() {
  if [ $_success = false ]; then
    printf "\nYour installation did not complete successfully.\n"
    printf "Please report any issues encountered at https://gitlab.com/DatePoll/WaiterRobot/WaiterRobot-Frontend/issues\n\n"
  fi
  rm -rf "$INSTALL_TEMP_DIRECTORY"
}
trap shutdown INT TERM ABRT EXIT

# Activity spinner for background processes.
spinner() {
  spinDelay='0.3'
  spinStr='\|/-'
  spinTemp=''
  while ps -p "$1" >>/dev/null; do
    spinTemp="${spinStr#?}"
    printf " [${BLUE}%c${RESET}]  " "${spinStr}"
    spinStr=${spinTemp}${spinStr%"${spinTemp}"}
    sleep "${spinDelay}"
    printf "\b\b\b\b\b\b"
  done
  printf "\r"
}

# Check for a required tool, or exit
requireTool() {
  which "$1" >>/dev/null && EC=$? || EC=$?
  if [ $EC != 0 ]; then
    errorAndExit "Could not locate \"$1\", which is required for installation."
  fi
}

checkSudoPermissions() {
  printf "${BLUE}Checking${RESET} for sufficient permissions..." & spinner $!
  if [ "$(id -u)" -ne 0 ]; then
    errorAndExit "Insufficient permissions. Sudo required!"
  fi
  printf "${GREEN}Successfully${RESET} acquired sudo permissions [${GREEN}✓${RESET}]\n"
}

# Determine operating system & architecture (and exit if not supported)
checkSystemArchitecture() {
  printf "${BLUE}Checking${RESET} for supported architecture..." & spinner $!
  case $(uname -s) in
  "Linux")
    case "$(uname -m)" in
    "x86_64") printf "${GREEN}Successfully${RESET} found supported architecture [${GREEN}✓${RESET}]\n";;
    *) errorAndExit "Unsupported CPU architecture $(uname -m)" ;;
    esac
    ;;
  *) errorAndExit "Unsupported operating system $(uname -s)" ;;
  esac
}

# Confirm install with user input or -f argument
confirmToContinue() {
  if [ $FORCE = false ]; then
    printf "${BOLD}Are you sure you want to install / update WaiterRobot-Web? [y/N]${RESET} "
    read -r prompt
    # Convert to uppercase
    prompt=$(echo "$prompt" | tr '[:lower:]' '[:upper:]')
    if [ "$prompt" != "Y" ] && [ "$prompt" != "YES" ] && [ "$prompt" != "YE" ]; then
      _success=true
      errorAndExit "User aborted. Next time type ['y', 'yes', 'ye] to continue"
    fi
  fi
}

main() {
  confirmToContinue

  printf "Info: Using version ${BOLD}${VERSION}${RESET}\n"

  # Check for sufficient permissions
  #checkSudoPermissions

  # Check if required tools are installed
  printf "${BLUE}Checking${RESET} for required tools..." & spinner $!
  requireTool "curl"
  requireTool "mkdir"
  requireTool "chmod"
  requireTool "mv"
  requireTool "rm"
  requireTool "zip"
  requireTool "unzip"
  printf "${GREEN}Successfully${RESET} found all required tools [${GREEN}✓${RESET}]\n"

  checkSystemArchitecture

  FRONTEND_DOWNLOAD_URL="https://releases.datepoll.org/WaiterRobot/Web-Releases/WaiterRobot-Web-${VERSION}.zip"

  printf "${BLUE}Clearing${RESET} tmp folder"
  (rm -rf "${INSTALL_TEMP_DIRECTORY}" && mkdir "${INSTALL_TEMP_DIRECTORY}") &
  spinner $!
  printf "${GREEN}Successfully${RESET} cleared tmp folder [${GREEN}✓${RESET}]\n"

  # Download compiled code
  printf "${BLUE}Downloading${RESET} WaiterRobot-Web-${VERSION}.zip"
  (curl -s -L ${FRONTEND_DOWNLOAD_URL} --output "${INSTALL_TEMP_DIRECTORY}/WaiterRobot-Web-${VERSION}.zip") &
  spinner $!

  # Check if zip is corrupted
  if ! zip --test "${INSTALL_TEMP_DIRECTORY}/WaiterRobot-Web-${VERSION}.zip" | grep -q 'OK'; then
    errorAndExit "Could not download file or zip is corrupted"
  fi

  printf "${GREEN}Successfully${RESET} downloaded WaiterRobot-Web-${VERSION} [${GREEN}✓${RESET}]\n"

  # Unzip downloaded release
  printf "${BLUE}Unzipping${RESET} WaiterRobot-Web-${VERSION}.zip... "
  (unzip -qq "${INSTALL_TEMP_DIRECTORY}/WaiterRobot-Web-${VERSION}.zip" -d "${INSTALL_TEMP_DIRECTORY}/") &
  spinner $!
  printf "${GREEN}Successfully${RESET} unzipped WaiterRobot-Web-${VERSION}.zip [${GREEN}✓${RESET}]\n"

  # Recreate frontend install folder
  printf "${BLUE}Clearing${RESET} frontend install folder... "
  (rm -rf "$FRONTEND_INSTALL_DIRECTORY" && mkdir "$FRONTEND_INSTALL_DIRECTORY") &
  spinner $!
  printf "${GREEN}Successfully${RESET} cleared frontend install folder [${GREEN}✓${RESET}]\n"

  # Move files into place
  printf "${BLUE}Moving${RESET} files into place... "
  (mv ./waiterrobot-web-tmp/WaiterRobot-Web/* ./waiterrobot-web/) &
  spinner $!
  printf "${GREEN}Successfully${RESET} moved files into place [${GREEN}✓${RESET}]\n"

  # Set 777 permissions
  printf "${BLUE}Applying${RESET} permissions... "
  (chmod -R 777 "$FRONTEND_INSTALL_DIRECTORY" 2>/dev/null) &
  spinner $!
  printf "${GREEN}Successfully${RESET} applied permissions [${GREEN}✓${RESET}]\n"

  printf "${GREEN}Finished${RESET} the frontend update ${BOLD}flawlessly${RESET}.\n"
  printf "Visit ${UNDERLINE}https://gitlab.com/Datepoll/WaiterRobot/WaiterRobot-Web/-/releases${RESET} to learn more about the latest updates.\n\n"

  _success=true
}

main
