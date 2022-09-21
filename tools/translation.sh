#!/usr/bin/env bash
main () {
 node ./tools/generateTranslation.js https://translate.dafnik.me/translate de en
 node ./tools/generateTranslation.js https://translate.dafnik.me/translate de fr
 node ./tools/generateTranslation.js https://translate.dafnik.me/translate de es
 node ./tools/generateTranslation.js https://translate.dafnik.me/translate de it
 node ./tools/generateTranslation.js https://translate.dafnik.me/translate de pt

 prettier --config ./.prettierrc --write ./src/assets/i18n

 printf "\nFinished!"
}
time main
