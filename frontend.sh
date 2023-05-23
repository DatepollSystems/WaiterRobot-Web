#!/bin/sh

# exit the script on command errors or unset variables
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
# shellcheck disable=SC2039
# shellcheck disable=SC2059

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
APP_NAME='WaiterRobot-Web'
SCRIPT_VERSION='2.0.1'
VERSION=latest
FORCE=false
CLEAR_TEMP_DIR=true

if ! [ "${FRONTEND_INSTALL_DIRECTORY:-}" ]; then
  FRONTEND_INSTALL_DIRECTORY="$(pwd)/installed"
fi
INSTALL_TEMP_DIRECTORY="$(pwd)/download-tmp"

# Set up an exit handler so we can print a help message on failures.
_success=false

printHelp() {
  printf "${BOLD}${UNDERLINE}${APP_NAME} installation help (${GREEN}v${SCRIPT_VERSION}${RESET}${UNDERLINE})${RESET}\n"
  printf "Usage: ./frontend.sh -v [version] -f -s\n"
  printf "  -v ['prod', 'lava', 'rc']  (optional) select a specific version to install\n"
  printf "  -f                         (optional) force install without asking questions\n"
  printf "  -s                         (optional) skip deletion of temporary folder after run\n"
  _success=true
  exit 0
}

while getopts "v:fsh" opt; do
  case "${opt}" in
  h)
    printHelp
    ;;
  f)
    FORCE=true
    ;;
  s)
    CLEAR_TEMP_DIR=false
    ;;
  v)
    if [ "$OPTARG" = "prod" ]; then
      VERSION=latest
    elif [ "$OPTARG" = "rc" ]; then
      VERSION=rc
    elif [ "$OPTARG" = "lava" ]; then
      VERSION=lava
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

printInfo() {
  printf "Script version: ${BOLD}${GREEN}${SCRIPT_VERSION}${RESET}\n"
  printf "${APP_NAME} version: ${BOLD}${VERSION}${RESET}\n"
  printf "Parameters: (force ${BOLD}${FORCE}${RESET}) (clear tmp dir ${BOLD}${CLEAR_TEMP_DIR})${RESET}\n"
}

# Shutdown handling
shutdown() {
  if [ $CLEAR_TEMP_DIR = true ]; then
    rm -rf "$INSTALL_TEMP_DIRECTORY"
    printf "${GREEN}Successfully${RESET} deleted temp folder [${GREEN}✓${RESET}]\n"
  fi
  if [ $_success = false ]; then
    printf "\n${RED}${UNDERLINE}Your installation did not complete successfully.${RESET}\n"
    printf "Please report any issues encountered at https://github.com/DatepollSystems/WaiterRobot-Web/issues\n\n"
  else
    printf "${GREEN}Finished${RESET} the frontend update ${BOLD}flawlessly${RESET}.\n"
    printf "Visit ${UNDERLINE}https://github.com/DatepollSystems/WaiterRobot-Web${RESET} to learn more about the latest updates.\n\n"
  fi
}
trap shutdown INT TERM ABRT EXIT

# Print an error message and exit the program.
errorAndExit() {
  printf "\n${RED}ERROR:${RESET} %s\n" "$1"
  exit 1
}


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
  printf "${BLUE}Checking${RESET} for sufficient permissions..." &
  spinner $!
  if [ "$(id -u)" -ne 0 ]; then
    errorAndExit "Insufficient permissions. Sudo required!"
  fi
  printf "${GREEN}Successfully${RESET} acquired sudo permissions [${GREEN}✓${RESET}]\n"
}

# Determine operating system & architecture (and exit if not supported)
checkSystemArchitecture() {
  printf "${BLUE}Checking${RESET} for supported architecture..." &
  spinner $!
  case $(uname -s) in
  "Linux")
    case "$(uname -m)" in
    "x86_64") printf "${GREEN}Successfully${RESET} checked for supported architecture [${GREEN}✓${RESET}]\n" ;;
    *) errorAndExit "Unsupported CPU architecture $(uname -m)" ;;
    esac
    ;;
  *) errorAndExit "Unsupported operating system $(uname -s)" ;;
  esac
}

# Confirm install with user input or -f argument
confirmToContinue() {
  if [ $FORCE = false ]; then
    printf "${BOLD}Are you sure you want to continue installing / updating ${APP_NAME}? [y/N]${RESET} "
    read -r prompt
    # Convert to uppercase
    prompt=$(echo "$prompt" | tr '[:lower:]' '[:upper:]')
    if [ "$prompt" != "Y" ] && [ "$prompt" != "YES" ] && [ "$prompt" != "YE" ]; then
      CLEAR_TEMP_DIR=false
      errorAndExit "User aborted. Next time type ['y', 'yes', 'ye'] to continue"
    fi
  fi
}

main() {
  printInfo

  confirmToContinue

  #checkSudoPermissions
  #checkSystemArchitecture

  # Check if required tools are installed
  printf "${BLUE}Checking${RESET} for required tools..." &
  spinner $!
  requireTool "curl"
  requireTool "mkdir"
  requireTool "chmod"
  requireTool "mv"
  requireTool "rm"
  requireTool "zip"
  requireTool "unzip"
  requireTool "grep"
  printf "${GREEN}Successfully${RESET} checked for required tools [${GREEN}✓${RESET}]\n"

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

  printf "${GREEN}Successfully${RESET} downloaded WaiterRobot-Web-${VERSION}.zip [${GREEN}✓${RESET}]\n"

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
  (mv "$INSTALL_TEMP_DIRECTORY"/WaiterRobot-Web/* "$FRONTEND_INSTALL_DIRECTORY"/) &
  spinner $!
  printf "${GREEN}Successfully${RESET} moved files into place [${GREEN}✓${RESET}]\n"

  # Set 777 permissions
  printf "${BLUE}Applying${RESET} permissions... "
  (chmod -R 777 "$FRONTEND_INSTALL_DIRECTORY" 2>/dev/null) &
  spinner $!
  printf "${GREEN}Successfully${RESET} applied permissions [${GREEN}✓${RESET}]\n"

  _success=true
}

main


