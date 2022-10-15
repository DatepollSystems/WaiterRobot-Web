#!/usr/bin/sh
main () {
 translate-cli autoTranslate https://translate.dafnik.me/translate en
 translate-cli autoTranslate https://translate.dafnik.me/translate fr
 translate-cli autoTranslate https://translate.dafnik.me/translate es
 translate-cli autoTranslate https://translate.dafnik.me/translate it
 translate-cli autoTranslate https://translate.dafnik.me/translate pt

 prettier --config ./.prettierrc --write ./src/assets/i18n

 printf "\nFinished!"
}
time main
