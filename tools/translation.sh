#!/usr/bin/sh
main () {
 translate-cli autoTranslate https://translate.foxhaven.cyou en
 translate-cli autoTranslate https://translate.foxhaven.cyou fr
 translate-cli autoTranslate https://translate.foxhaven.cyou es
 translate-cli autoTranslate https://translate.foxhaven.cyou it
 translate-cli autoTranslate https://translate.foxhaven.cyou pt

 prettier --config ./.prettierrc --write ./src/assets/i18n

 printf "\nFinished!"
}
time main
